import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostGateway } from './post.gateway';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostGateway],
})
export class PostsModule {}
