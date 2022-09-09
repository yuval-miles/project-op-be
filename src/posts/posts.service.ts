import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Post } from '@prisma/client';
import { Request, Response } from 'express';
import { ServerResponse } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostDto } from './dto/post.dto';
import { FilterDto } from './dto/posts-filter.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  private posts: Post[] = [];
  async createPost(dto: PostDto, res: Response) {
    const { text, picture, userId, anon, comments } = dto;

    const newPost = await this.prisma.post.create({
      data: {
        text,
        picture,
        userId,
        anon,
        comments,
      },
    });

    if (!newPost)
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    return res.send({ message: 'Posted successfully', response: newPost });
  }

  async deletePost(postId: string, res: Response) {
    const deletePost = await this.prisma.post.delete({
      where: {
        id: postId,
      },
    });
    if (!deletePost) throw new NotFoundException('Post not found');

    return res.send({ message: 'Deleted successfully', response: deletePost });
  }
  async getAllPosts(res: Response) {
    this.posts = await this.prisma.post.findMany();
    return res.send({ message: 'success', response: this.posts });
  }

  async getPostsById(filterDto: FilterDto, res: Response) {
    const { userId } = filterDto;
    console.log(userId);
    let posts;
    if (userId) {
      posts = await this.prisma.post.findMany({
        where: {
          userId: {
            equals: userId,
          },
        },
      });
      console.log(posts);
    } else {
      throw new NotFoundException('Post not found');
    }
    return res.send({ message: 'success', response: posts });
  }
}
