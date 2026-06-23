import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Body()
    body: {
      content: string;
      authorId: string;
      postId: string;
      parentId?: string;
    },
  ) {
    return this.commentsService.create(body);
  }

  @Patch(':id/like')
  toggleLike(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    return this.commentsService.toggleLike(id, body.userId);
  }

  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.commentsService.findByPost(postId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}