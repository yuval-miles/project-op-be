import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostGateway } from './post.gateway';
import { CommentGateway } from './comments.gateway';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostGateway, CommentGateway],
})
export class PostsModule {}
