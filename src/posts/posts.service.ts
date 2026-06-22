import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreatePostDto) {
    return this.prisma.post.create({ data });
  }

  findAll() {
    return this.prisma.post.findMany({
      include: { author: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  findByUser(userId: string) {
    return this.prisma.post.findMany({
      where: { authorId: userId },
      include: { author: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
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