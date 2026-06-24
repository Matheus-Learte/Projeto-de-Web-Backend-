import { Module } from '@nestjs/common';
import { CommunityCommentsService } from './community-comments.service';
import { CommunityCommentsController } from './community-comments.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
      PrismaModule,
      NotificationsModule,
    ],
  providers: [CommunityCommentsService, PrismaService],
  controllers: [CommunityCommentsController]
})
export class CommunityCommentsModule {}
