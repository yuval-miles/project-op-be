import {
  Delete,
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
    const foundUser = await this.prisma.user.findUnique({ where: { id } });
    if (!foundUser) throw new NotFoundException();
    const decodedUser = req.user as { id: string; email: string };

    if (foundUser.id !== decodedUser.id) throw new ForbiddenException();
    // delete foundUser.hash;
    return { foundUser };
  }
}
