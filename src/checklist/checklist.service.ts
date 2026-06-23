import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChecklistService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, content: string) {
    console.log('USER:', userId);
    console.log('CONTENT:', content);
    return this.prisma.checklistItem.create({
      data: {
        userId,
        content,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.checklistItem.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  toggle(id: string, userId: string) {
    // pega o item primeiro pra inverter o valor
    return this.prisma.checklistItem.findFirst({
      where: { id, userId },
    }).then(item => {
      if (!item) return null;

      return this.prisma.checklistItem.update({
        where: { id },
        data: {
          done: !item.done,
        },
      });
    });
  }

  remove(id: string, userId: string) {
    return this.prisma.checklistItem.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }
}