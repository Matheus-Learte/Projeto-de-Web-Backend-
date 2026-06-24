import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService, private readonly notificationsService: NotificationsService,) {}

  create(data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) {
    return this.prisma.user.create({
      data,
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        name:true,
        bio: true,
        avatar: true,
        pronoun: true,
        studyTime: true,
        role: true,
        refreshToken: true,
        createdAt: true,
        updatedAt: true,
        followers: true,
        following: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  updateRefreshToken(userId: string, token: string | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: token,
      },
    });
  }

  // READ ALL
  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        bio: true,
        avatar: true,
        pronoun: true,
        studyTime: true,
      },
    });
  }

  async searchUsers(query: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            username: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
      },
    });
  }

  async toggleFollow(followerId: string, followingId: string) {

    if (followerId === followingId) {
      return { following: false };
    }

    const existing = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    // UNFOLLOW
    if (existing) {
      await this.prisma.follow.delete({
        where: { id: existing.id },
      });

      return { following: false };
    }

    // FOLLOW
    await this.prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    // pegar username de quem seguiu
    const follower = await this.prisma.user.findUnique({
      where: { id: followerId },
      select: { username: true },
    });

    // criar notificação
    await this.notificationsService.create(
      followingId,
      'FOLLOW',
      `${follower?.username ?? 'Alguém'} começou a te seguir`,
    );

    return { following: true };
  }

  async getFollowStatus(followerId: string, followingId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return { following: !!follow };
  }

  // UPDATE
  update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // DELETE
  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  // Pomodoro
  async addStudyTime(id: string, hours: number) {
    return this.prisma.user.update({
      where: { id },
      data: {
        studyTime: {
          increment: hours,
        },
      },
    });
  }
}
