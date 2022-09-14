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
import { Response, Request } from 'express';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { FilterDto } from './dto/posts-filter.dto';
// @UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('createPost')
  createPost(@Body() dto: PostDto, @Res() res: Response) {
    return this.postsService.createPost(dto, res);
  }

  @Delete(':id')
  deletePost(@Param() params: { id: string }, @Res() res: Response) {
    return this.postsService.deletePost(params.id, res);
  }

  @Get()
  getPosts(
    @Res() res: Response,
    @Req() req: Request,
    @Query() filterDto: FilterDto,
  ) {
    return this.postsService.getAllPosts(filterDto, res, req);
  }
  @Get('/:postId/getcomments')
  getPostsComments(@Param() params: { postId: string }) {
    console.log(params);
    return this.postsService.getPostsComments(params.postId);
  }
}
