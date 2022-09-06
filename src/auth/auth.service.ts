import { BadGatewayException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constants';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

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

  async signIn(dto: AuthDto) {
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
      email: foundUser.email,
    });
    return { token };
  }
  async signOut(dto: AuthDto) {
    const { email, password } = dto;
    return '';
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePasswords(args: { password: string; hash: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: { id: string; email: string }) {
    const payload = args;
    return this.jwt.signAsync(payload, { secret: jwtSecret });
  }
}
