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
import { Request, Response } from 'express';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { FilterDto } from './dto/posts-filter.dto';
@UseGuards(JwtAuthGuard)
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('createPost')
  createPost(@Body() dto: PostDto, @Res() res: Response) {
    return this.postsService.createPost(dto, res);
  }

  @Delete(':id')
  deletePost(
    @Param() params: { id: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.postsService.deletePost(params.id, res, req);
  }

  @Get()
  getPosts(@Res() res: Response, @Query() filterDto: FilterDto) {
    return this.postsService.getAllPosts(filterDto, res);
  }
}
