import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostDto } from './dto/post.dto';
import { FilterDto } from './dto/posts-filter.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(dto: PostDto, res: Response) {
    const { text, picture, userId, anon, comments } = dto;
    let newPost;
    try {
      newPost = await this.prisma.post.create({
        data: {
          text,
          picture,
          userId,
          anon,
          comments,
        },
      });
    } catch {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
    return res.send({ message: 'Posted successfully', response: newPost });
  }

  async deletePost(postId: string, res: Response) {
    try {
      await this.prisma.post.delete({
        where: {
          id: postId,
        },
      });
    } catch {
      throw new NotFoundException('Post not found');
    }

    return res.send({ message: 'Deleted successfully' });
  }
  async getAllPosts(res: Response) {
    try {
      const posts = await this.prisma.post.findMany();
      return res.send({ message: 'success', response: posts });
    } catch {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  async getPostsById(filterDto: FilterDto, res: Response) {
    const { userId } = filterDto;
    console.log(userId);
    let posts;
    if (userId) {
      try {
        posts = await this.prisma.post.findMany({
          where: {
            userId: {
              equals: userId,
            },
          },
        });
        if (posts.length === 0) throw new NotFoundException('Posts not found');
      } catch (err) {
        throw err;
      }
    }

    return res.send({ message: 'success', response: posts });
  }
}
