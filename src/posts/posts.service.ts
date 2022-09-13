import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Response, Request } from 'express';
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

  async getAllPosts(filterDto: FilterDto, res: Response, req: Request) {
    const { userId, sort, sortBy } = filterDto;
    const decodedUser = req.user as { id: string };
    let posts;
    const orderBy =
      sortBy && sort
        ? sortBy === 'likes'
          ? {
              likes: {
                _count: sort,
              },
            }
          : sortBy === 'date'
          ? {
              updatedAt: sort,
            }
          : {
              disLikes: {
                _count: sort,
              },
            }
        : {};
    if (userId) {
      try {
        posts = await this.prisma.post.findMany({
          where: {
            userId: {
              equals: userId,
            },
          },
          orderBy,
          include: {
            likes: true,
            dislikes: true,
          },
        });
        if (posts.length === 0) throw new NotFoundException('Posts not found');
      } catch (err) {
        throw err;
      }
    } else {
      try {
        const posts = await this.prisma.post.findMany({
          orderBy,
          include: {
            likes: {
              select: {
                id: true,
                userId: true,
              },
            },
            dislikes: {
              select: { id: true },
            },
          },
        });
        const myLikes = await this.prisma.like.findMany({
          include: {
            post: {
              select: {
                id: true,
              },
            },
          },
          where: {
            userId: decodedUser.id,
          },
        });
        const myLikesObj: { [key: string]: boolean } = {};
        myLikes.forEach((el) => (myLikesObj[el.post?.id as string] = true));
        return res.send({
          message: 'success',
          response: { posts, myLikesObj },
        });
      } catch {
        throw new InternalServerErrorException(
          'Something went wrong, please try again later',
        );
      }
    }

    return res.send({ message: 'success', response: posts });
  }
}
