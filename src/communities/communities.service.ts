import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunitiesService {
  constructor(private prisma: PrismaService) {}

  // CREATE COMMUNITY
  async create(data: {
    name: string;
    description?: string;
    image?: string;
    wallpaper?: string;
    adminId: string;
  }) {
    const community = await this.prisma.community.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        wallpaper: data.wallpaper,
        adminId: data.adminId,
      },
    });

    // automaticamente adiciona o admin como membro também
    await this.prisma.communityMember.create({
      data: {
        userId: data.adminId,
        communityId: community.id,
        role: 'admin',
      },
    });

    return community;
  }

  // LIST ALL COMMUNITIES
  async findAll() {
    return this.prisma.community.findMany({
      include: {
        admin: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async joinCommunity(userId: string, communityId: string) {
    const existing = await this.prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    });

    if (existing) {
      return { message: 'Already a member' };
    }

    return this.prisma.communityMember.create({
      data: {
        userId,
        communityId,
        role: 'member',
      },
    });
  }

  async leaveCommunity(userId: string, communityId: string) {
    return this.prisma.communityMember.deleteMany({
      where: {
        userId,
        communityId,
      },
    });
  }

  async updateCommunity(
    communityId: string,
    userId: string,
    data: {
      name?: string;
      description?: string;
      image?: string;
      wallpaper?: string;
    },
  ) {
    const community = await this.prisma.community.findUnique({
      where: { id: communityId },
    });

    if (!community) {
      throw new Error('Community not found');
    }

    if (community.adminId !== userId) {
      throw new ForbiddenException('Only admin can edit this community');
    }

    return this.prisma.community.update({
      where: { id: communityId },
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        wallpaper: data.wallpaper,
      },
    });
  }

  async removeCommunity(communityId: string, userId: string) {
    const community = await this.prisma.community.findUnique({
      where: { id: communityId },
    });

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    if (community.adminId !== userId) {
      throw new ForbiddenException('Only admin can delete this community');
    }

    return this.prisma.community.delete({
      where: { id: communityId },
    });
  }
}