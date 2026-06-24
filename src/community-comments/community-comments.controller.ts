import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CommunityCommentsService } from './community-comments.service';

@Controller('community-comments')
export class CommunityCommentsController {
  constructor(private service: CommunityCommentsService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get(':postId')
  findByPost(@Param('postId') postId: string) {
    return this.service.findByPost(postId);
  }

  @Post(':id/like')
  toggleLike(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.service.toggleLike(id, body.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}