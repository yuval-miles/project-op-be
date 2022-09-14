import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private auth: AuthService,
    private config: ConfigService,
  ) {}
  async getMyUser(id: string, req: Request) {
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { id },
        select: { username: true, email: true, id: true },
      });
      if (!foundUser) throw new NotFoundException('User not found');
      const decodedUser = req.user as { id: string; email: string };
      if (foundUser.id !== decodedUser.id) throw new ForbiddenException();

      return { message: 'success', response: foundUser };
    } catch (err) {
      throw err;
    }
  }

  async updateUser(id: string, req: Request, dto: UserDto) {
    const { username, email, picture, password } = dto;
    const decodedUser = req.user as {
      id: string;
    };
    if (id !== decodedUser.id) throw new ForbiddenException();
    try {
      let hashed;
      const foundUser = await this.prisma.user.findUnique({
        where: { id },
        select: {
          username: true,
          email: true,
          id: true,
          picture: true,
          hash: true,
        },
      });
      if (!foundUser) throw new NotFoundException('User not found');

      if (email && foundUser.email === email)
        throw new ForbiddenException('Email already exists');
      if (username && foundUser.username === username)
        throw new ForbiddenException('Username already exists');
      if (password) {
        hashed = await this.auth.hashPassword(password);
      }
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          email: email || foundUser.email,
          username: username || foundUser.username,
          picture: picture || foundUser.picture,
          hash: hashed || foundUser.hash,
        },
      });
      return { message: 'User successfully updated', response: updatedUser };
    } catch (err) {
      throw err;
    }
  }
}
