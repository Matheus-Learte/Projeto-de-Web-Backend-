import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch
} from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private service: MessagesService) {}

  @Post()
  send(@Body() body: any) {
    return this.service.sendMessage(body);
  }

  @Get('inbox/:userId')
  inbox(@Param('userId') userId: string) {
    return this.service.getInbox(userId);
  }

  @Get('conversation')
  conversation(
    @Query('userId') userId: string,
    @Query('otherUserId') otherUserId: string,
  ) {
    return this.service.getConversation(userId, otherUserId);
  }

  @Get('unread/:userId')
  unread(@Param('userId') userId: string) {
    return this.service.getUnreadCount(userId);
  }

  @Patch('read/:userId')
  markAsRead(
    @Param('userId') otherUserId: string,
    @Body() body: { currentUserId: string },
  ) {
    return this.service.markAsRead(
      body.currentUserId,
      otherUserId,
    );
  }
}