import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CommunitiesService } from './communities.service';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly service: CommunitiesService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post(':id/join')
  join(@Body() body: { userId: string }, @Param('id') id: string) {
    return this.service.joinCommunity(body.userId, id);
  }

  @Post(':id/leave')
  leave(@Body() body: { userId: string }, @Param('id') id: string) {
    return this.service.leaveCommunity(body.userId, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.service.updateCommunity(
      id,
      body.userId,
      body,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    return this.service.removeCommunity(
      id,
      body.userId,
    );
  }
}