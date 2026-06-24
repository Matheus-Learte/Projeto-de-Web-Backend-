import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService, private notificationsService: NotificationsService,) {}

  async create(data: {
    content: string;
    authorId: string;
    postId: string;
    parentId?: string;
  }) {
    const post = await this.prisma.post.findUnique({
      where: { id: data.postId },
      select: {
        authorId: true,
      },
    });

    const comment = await this.prisma.comment.create({
      data,
      include: {
        author: true,
        replies: {
          include: {
            author: true,
          },
        },
      },
    });

    if (post && post.authorId !== data.authorId) {
      await this.notificationsService.create(
        post.authorId,
        'COMMENT',
        'Alguém comentou no seu post',
      );
    }

    return comment;
  }

  findByPost(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId, parentId: null },
      include: {
        author: true,

        commentLikes: true,

        replies: {
          include: {
            author: true,
            commentLikes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async toggleLike(commentId: string, userId: string) {
    const existing = await this.prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (existing) {
      await this.prisma.commentLike.delete({
        where: { id: existing.id },
      });

      await this.prisma.comment.update({
        where: { id: commentId },
        data: {
          likes: { decrement: 1 },
        },
      });

      return { liked: false };
    }

    await this.prisma.commentLike.create({
      data: { userId, commentId },
    });

    await this.prisma.comment.update({
      where: { id: commentId },
      data: {
        likes: { increment: 1 },
      },
    });

    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        likes: true,
      },
    });

    return {
      liked: true,
      likes: comment?.likes ?? 0,
    }; 
  }

  async remove(id: string) {
    return this.prisma.comment.delete({
      where: {
        id,
      },
    });
  }
}