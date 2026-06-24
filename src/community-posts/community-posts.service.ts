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
}