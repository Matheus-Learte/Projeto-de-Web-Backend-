import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
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
  async addStudyTime(id: string, minutes: number) {
    return this.prisma.user.update({
      where: { id },
      data: {
        studyTime: {
          increment: minutes,
        },
      },
    });
  }
}
