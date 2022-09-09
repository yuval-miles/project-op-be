import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostDto } from './dto/post.dto';
import { Response } from 'express';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { FilterDto } from './dto/posts-filter.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createPost')
  createPost(@Body() dto: PostDto, @Res() res: Response) {
    return this.postsService.createPost(dto, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletePost(@Param() params: { id: string }, @Res() res: Response) {
    return this.postsService.deletePost(params.id, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  getPosts(@Res() res: Response, @Query() filterDto: FilterDto) {
    if (Object.keys(filterDto).length) {
      return this.postsService.getPostsById(filterDto, res);
    } else {
      return this.postsService.getAllPosts(res);
    }
  }
}
