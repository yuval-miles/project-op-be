import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const { email, username, password } = dto;
    const foundEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    const foundUsername = await this.prisma.user.findUnique({
      where: { username },
    });

    if (foundEmail) {
      throw new BadGatewayException('Email already exists');
    }
    if (foundUsername) {
      throw new BadGatewayException('Username already exists');
    }

    const hash = await this.hashPassword(password);
    await this.prisma.user.create({
      data: {
        email,
        hash,
        username,
      },
    });

    return { message: 'signup was successful' };
  }

  async signIn(dto: AuthDto, res: Response) {
    const { email, password } = dto;

    const foundUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!foundUser) {
      throw new BadGatewayException('Wrong credentials');
    }
    const isMatch = await this.comparePasswords({
      password,
      hash: foundUser.hash,
    });
    if (!isMatch) {
      throw new BadGatewayException('Wrong credentials');
    }
    const token = await this.signToken({
      id: foundUser.id,
      username: foundUser.username,
      picture: foundUser.picture,
    });
    if (!token) {
      throw new ForbiddenException();
    }

    res.cookie('token', token, { httpOnly: true });

    return res.send({ message: 'Logged in successfully' });
  }

  async signOut(res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logged out successfully' });
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePasswords(args: { password: string; hash: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: {
    id: string;
    username: string;
    picture: string | null;
  }) {
    const payload = args;
    const secret = this.config.get('JWT_SECRET');
    return this.jwt.signAsync(payload, { secret: secret });
  }
}
