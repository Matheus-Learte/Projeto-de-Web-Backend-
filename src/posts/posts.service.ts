import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    content: string;
    authorId: string;
  }) {
    return this.prisma.post.create({
      data,
      include: {
        author: {
            select: {
            id: true,
            email: true,
            username: true,
            bio: true,
            avatar: true,
            pronoun: true,
            studyTime: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            },
        },
      }
    });
  }

  findAll() {
    return this.prisma.post.findMany({
      include: {
        author: {
            select: {
                id: true,
                email: true,
                username: true,
                bio: true,
                avatar: true,
                pronoun: true,
                studyTime: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findByUser(userId: string) {
    return this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
            select: {
                id: true,
                email: true,
                username: true,
                bio: true,
                avatar: true,
                pronoun: true,
                studyTime: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findById(id: string) {
    return this.prisma.post.findUnique({
        where: { id },
        include: {
        author: {
            select: {
                id: true,
                email: true,
                username: true,
                bio: true,
                avatar: true,
                pronoun: true,
                studyTime: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        },
        },
    });
    }

    async update(id: string, data: { content?: string; title?: string }) {
    return this.prisma.post.update({
        where: { id },
        data: {
        ...(data.content !== undefined && { content: data.content }),
        ...(data.title !== undefined && { title: data.title }),
        },
    });
    }

    remove(id: string) {
    return this.prisma.post.delete({
        where: { id },
    });
    }
}