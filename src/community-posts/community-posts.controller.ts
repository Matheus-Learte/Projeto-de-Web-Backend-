import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete
} from '@nestjs/common';

import { CommunityPostsService } from './community-posts.service';
import { CreateCommunityPostDto } from './dto/create-community-post.dto';

@Controller('community-posts')
export class CommunityPostsController {
  constructor(
    private readonly service: CommunityPostsService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateCommunityPostDto,
  ) {
    return this.service.create(dto);
  }

  @Get('/community/:id')
  findByCommunity(
    @Param('id') id: string,
  ) {
    return this.service.findByCommunity(id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    return this.service.remove(
        id,
        body.userId,
    );
  }
}