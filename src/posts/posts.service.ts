import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { Request, Response } from 'express';
import { ServerResponse } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  private posts: Post[] = [];
  async createPost(dto: PostDto, res: Response) {
    const { text, picture, userId } = dto;

    const newPost = await this.prisma.post.create({
      data: {
        text,
        picture,
        userId,
      },
    });
    return res.send({ message: 'Posted successfully', response: newPost });
  }

  async getAllPosts(res: Response) {
    this.posts = await this.prisma.post.findMany();

    return res.send({ message: 'success', response: this.posts });
  }
}
