import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostLikeDto } from './dto/post-like.dto';

@UseGuards(JwtAuthGuard)
@WebSocketGateway({
  cors: {
    origin: 'http://127.0.0.1:5173',
    credentials: true,
  },
})
export class PostGateway {
  constructor(private prisma: PrismaService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('likeEvent')
  async handleLikeEvent(@MessageBody() { userId, postId, type }: PostLikeDto) {
    const found = await this.prisma.like.findFirst({
      where: {
        AND: {
          userId,
          postId,
          type,
        },
      },
    });
    if (found)
      await this.prisma.like.delete({
        where: {
          id: found.id,
        },
      });
    else
      await this.prisma.like.create({
        data: {
          userId,
          postId,
          type,
        },
      });
    this.server.emit(postId, {
      action: found
        ? type === 'like'
          ? 'removeLike'
          : 'removeDislike'
        : type === 'like'
        ? 'addLike'
        : 'addDislike',
    });
  }
}
