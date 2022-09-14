import {
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostCommentDto } from './dto/post-comment.dto';

@UseGuards(JwtAuthGuard)
@WebSocketGateway({
  cors: {
    origin: 'http://127.0.0.1:5173',
    credentials: true,
  },
})
export class CommentGateway {
  constructor(private prisma: PrismaService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('commentEvent')
  async handleCommentEvent(
    @MessageBody()
    { userId, postId, message, action, commentId }: PostCommentDto,
  ) {
    const found = await this.prisma.post.findFirstOrThrow({
      where: { id: postId },
    });
    if (!found) throw new NotFoundException('Post not found');
    let newComment;
    if (action === 'create') {
      newComment = await this.prisma.comment.create({
        data: { postId, userId, message },
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      });
    } else if (userId === found.userId) {
      await this.prisma.comment.delete({
        where: { id: commentId },
      });
    } else {
      throw new ForbiddenException();
    }
    this.server.emit(postId, {
      action: !commentId ? newComment : 'comment deleted successfully',
    });
  }
}
