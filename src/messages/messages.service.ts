import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(data: {
    senderId: string;
    receiverId: string;
    content?: string;
    image?: string;
  }) {
    return this.prisma.message.create({
      data,
      include: {
        sender: true,
        receiver: true,
      },
    });
  }

  async getConversation(userId: string, otherUserId: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
  }

  async getInbox(userId: string) {
    return this.prisma.message.findMany({
      where: {
        receiverId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sender: true,
      },
    });
  }

  getUnreadCount(userId: string) {
    return this.prisma.message.count({
      where: {
        receiverId: userId,
        read: false,
      },
    });
  }

  async markAsRead(currentUserId: string, otherUserId: string) {
    return this.prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: currentUserId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }
}