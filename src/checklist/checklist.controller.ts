import {
  Controller,
  UseGuards,
  Post,
  Get,
  Delete,
  Patch,
  Req,
  Body,
  Param,
} from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { ChecklistService } from './checklist.service';

@UseGuards(AuthGuard)
@Controller('checklist')
export class ChecklistController {
  constructor(private service: ChecklistService) {}

  @Post()
  create(@Req() req, @Body() body: { content: string }) {
    return this.service.create(req.user.sub, body.content);
  }

  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user.sub);
  }

  @Patch(':id/toggle')
  toggle(@Req() req, @Param('id') id: string) {
    return this.service.toggle(id, req.user.sub);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.service.remove(id, req.user.sub);
  }
}