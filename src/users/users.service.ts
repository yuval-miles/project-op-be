import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
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
}
