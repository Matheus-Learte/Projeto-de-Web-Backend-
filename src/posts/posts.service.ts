import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreatePostDto) {
    return this.prisma.post.create({ data });
  }

  async findAll(userId?: string) {
    const posts = await this.prisma.post.findMany({
      include: {
        author: true,
        _count: {
          select: {
            comments: true,
          },
        },
        postLikes: true, // só aqui pra cálculo interno
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      image: post.image,
      createdAt: post.createdAt,
      likes: post.likes,
      author: post.author,
      authorId: post.authorId,
      communityId: (post as any).communityId,

      _count: post._count,

      likedByMe: userId
        ? post.postLikes.some((l) => l.userId === userId)
        : false,
    }));
  }

  async findOne(id: string, userId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        _count: {
          select: {
            comments: true,
          },
        },
        postLikes: true,
      },
    });

    if (!post) return null;

    return {
      ...post,
      likedByMe: userId
        ? post.postLikes.some((l) => l.userId === userId)
        : false,
    };
  }

  findByUser(userId: string) {
    return this.prisma.post.findMany({
      where: { authorId: userId },
      include: {
        author: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async toggleLike(postId: string, userId: string) {
    const existing = await this.prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existing) {
      await this.prisma.postLike.delete({
        where: { id: existing.id },
      });

      await this.prisma.post.update({
        where: { id: postId },
        data: {
          likes: { decrement: 1 },
        },
      });

      return { liked: false };
    }

    await this.prisma.postLike.create({
      data: { userId, postId },
    });

    await this.prisma.post.update({
      where: { id: postId },
      data: {
        likes: { increment: 1 },
      },
    });

    return { liked: true };
  }

  update(id: string, data: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.post.delete({
      where: { id },
    });
  }

  removeByUser(userId: string) {
    return this.prisma.post.deleteMany({
      where: { authorId: userId },
    });
  }
}