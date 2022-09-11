import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
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
      throw new BadRequestException('Email already exists');
    }
    if (foundUsername) {
      throw new BadRequestException('Username already exists');
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
      throw new BadRequestException('Email or password is incorrect');
    }
    const isMatch = await this.comparePasswords({
      password,
      hash: foundUser.hash,
    });
    if (!isMatch) {
      throw new BadRequestException('Email or password is incorrect');
    }
    const token = await this.signToken({
      id: foundUser.id,
      username: foundUser.username,
      picture: foundUser.picture,
    });
    if (!token) {
      throw new ForbiddenException();
    }
    res.cookie('token', token, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'development' ? false : true,
      sameSite: this.config.get('NODE_ENV') === 'development' ? 'lax' : 'none',
    });

    return res.send({ message: 'Logged in successfully' });
  }

  async signOut(res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logged out successfully' });
  }

  async getAuth(req: Request) {
    if (req.cookies && 'token' in req.cookies) {
      const payload = this.jwt.decode(req.cookies.token);
      if (typeof payload === 'object')
        return { ...payload, raw: req.cookies.token };
      else return false;
    }
    return false;
  }

  async checkEmail(email: string) {
    if (!email) return false;
    const found = await this.prisma.user.findUnique({
      where: {
        email: email.replace(/['"]+/g, ''),
      },
    });
    return !!found;
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
