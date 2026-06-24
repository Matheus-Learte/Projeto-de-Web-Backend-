import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ChecklistModule } from './checklist/checklist.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CommunitiesModule } from './communities/communities.module';
import { CommunityPostsModule } from './community-posts/community-posts.module';
import { CommunityCommentsModule } from './community-comments/community-comments.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 1000 }] }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    ChecklistModule,
    NotificationsModule,
    CommunitiesModule,
    CommunityPostsModule,
    CommunityCommentsModule,
    MessagesModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}