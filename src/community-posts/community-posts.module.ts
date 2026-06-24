import { Module } from '@nestjs/common';

import { CommunityPostsController } from './community-posts.controller';
import { CommunityPostsService } from './community-posts.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CommunityPostsController],
  providers: [CommunityPostsService],
})
export class CommunityPostsModule {}