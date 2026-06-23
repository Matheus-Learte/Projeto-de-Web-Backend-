import { Controller, Request, Get, Post, Body, Param, UseGuards, Patch, Put, Delete, Query, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('search')
  search(@Query('q') q: string) {
    return this.usersService.searchUsers(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    //id eh string
    return this.usersService.findById(id);
  }

  @Patch(':id/follow')
  toggleFollow(
    @Param('id') id: string,
    @Body() body: { followerId: string },
  ) {
    return this.usersService.toggleFollow(body.followerId, id);
  }

  @Get(':id/follow-status')
  followStatus(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    return this.usersService.getFollowStatus(userId, id);
  }

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: any,
    @Request() req,
  ) {
    if (req.user.sub !== id) {
      throw new UnauthorizedException();
    }

    return this.usersService.update(id, data);
  }

  // DELETE /users/:id
  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    if (req.user.sub !== id) {
      throw new UnauthorizedException();
    }

    return this.usersService.remove(id);
  }

  // PATCH /users/:id/study-time
  @UseGuards(AuthGuard)
  @Patch(':id/study-time')
  addStudyTime(
    @Param('id') id: string,
    @Body('hours') hours: number,
  ) {
    return this.usersService.addStudyTime(id, hours);
  }
}
