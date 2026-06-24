import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommunityCommentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(data: {
    content: string;
    authorId: string;
    postId: string; // CommunityPost id
    parentId?: string;
  }) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: data.postId },
      select: { authorId: true },
    });

    const comment = await this.prisma.communityComment.create({
      data,
      include: {
        author: true,
        replies: {
          include: { author: true },
        },
      },
    });

    if (post && post.authorId !== data.authorId) {
      await this.notificationsService.create(
        post.authorId,
        'COMMENT',
        'Alguém comentou no seu post da comunidade',
      );
    }

    return comment;
  }

  findByPost(postId: string) {
    return this.prisma.communityComment.findMany({
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleLike(commentId: string, userId: string) {
    const existing = await this.prisma.communityCommentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (existing) {
      await this.prisma.communityCommentLike.delete({
        where: { id: existing.id },
      });

      await this.prisma.communityComment.update({
        where: { id: commentId },
        data: { likes: { decrement: 1 } },
      });

      return { liked: false };
    }

    await this.prisma.communityCommentLike.create({
      data: { userId, commentId },
    });

    await this.prisma.communityComment.update({
      where: { id: commentId },
      data: { likes: { increment: 1 } },
    });

    return { liked: true };
  }

  remove(id: string) {
    return this.prisma.communityComment.delete({
      where: { id },
    });
  }
}