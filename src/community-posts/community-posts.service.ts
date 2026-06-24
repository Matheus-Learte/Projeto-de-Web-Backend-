import {
  ForbiddenException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCommunityPostDto } from './dto/create-community-post.dto';

@Injectable()
export class CommunityPostsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCommunityPostDto) {
    const member =
      await this.prisma.communityMember.findUnique({
        where: {
          userId_communityId: {
            userId: data.authorId,
            communityId: data.communityId,
          },
        },
      });

    if (!member) {
      throw new ForbiddenException(
        'You must be a member of this community',
      );
    }

    return this.prisma.communityPost.create({
      data,
      include: {
        author: true,
        community: true,
      },
    });
  }

  async findByCommunity(communityId: string) {
    return this.prisma.communityPost.findMany({
        where: {
        communityId,
        },
        include: {
        author: {
            select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            },
        },
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

    async remove(postId: string, userId: string) {
        const post = await this.prisma.communityPost.findUnique({
            where: { id: postId },
            include: {
            community: true,
            },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const isAuthor = post.authorId === userId;
        const isAdmin = post.community.adminId === userId;

        if (!isAuthor && !isAdmin) {
            throw new ForbiddenException(
            'You cannot delete this post',
            );
        }

        return this.prisma.communityPost.delete({
            where: {
            id: postId,
            },
        });
    }

    async toggleLike(postId: string, userId: string) {
      const existing = await this.prisma.communityPostLike.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      if (existing) {
        await this.prisma.communityPostLike.delete({
          where: { id: existing.id },
        });

        await this.prisma.communityPost.update({
          where: { id: postId },
          data: {
            likes: { decrement: 1 },
          },
        });

        return { liked: false };
      }

      const post = await this.prisma.communityPost.findUnique({
        where: { id: postId },
        select: {
          authorId: true,
        },
      });

      if (!post) {
        throw new Error('Post não encontrado');
      }

      await this.prisma.communityPostLike.create({
        data: {
          userId,
          postId,
        },
      });

      await this.prisma.communityPost.update({
        where: { id: postId },
        data: {
          likes: { increment: 1 },
        },
      });

      if (post.authorId !== userId) {
        await this.prisma.notification.create({
          data: {
            userId: post.authorId,
            type: 'LIKE',
            message: 'Alguém curtiu seu post na comunidade',
          },
        });
      }

      return { liked: true };
    }
}