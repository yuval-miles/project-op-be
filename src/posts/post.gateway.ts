import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { arch } from 'os';
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
    const foundLike = await this.prisma.like.findFirst({
      where: {
        AND: {
          userId,
          postId,
        },
      },
    });
    const foundDisLike = await this.prisma.disLike.findFirst({
      where: {
        AND: {
          userId,
          postId,
        },
      },
    });

    const addLike = async () => {
      await this.prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
    };
    const addDisLike = async () => {
      await this.prisma.disLike.create({
        data: {
          userId,
          postId,
        },
      });
    };
    const removeLike = async () => {
      foundLike &&
        (await this.prisma.like.delete({
          where: {
            id: foundLike.id,
          },
        }));
    };

    const removeDislike = async () => {
      foundDisLike &&
        (await this.prisma.disLike.delete({
          where: {
            id: foundDisLike.id,
          },
        }));
    };
    let action;
    try {
      if (type === 'like') {
        if (foundLike) {
          await removeLike();
          action = 'removeLike';
        } else {
          await addLike();
          action = 'addLike';
          if (foundDisLike) {
            action += '&&removeDislike';
            await removeDislike();
          }
        }
      }
      if (type === 'disLike') {
        if (foundDisLike) {
          await removeDislike();
          action = 'removeDislike';
        } else {
          await addDisLike();
          action = 'addDislike';
          if (foundLike) {
            action += '&&removeLike';
            await removeLike();
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
    this.server.emit(postId, {
      action: action,
    });
  }
}
