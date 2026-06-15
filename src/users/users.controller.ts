import { Controller, Get, Post, Body, Param, UseGuards, Patch, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    //id eh string
    return this.usersService.findById(id);
  }

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: CreateUserDto) {
    return this.usersService.update(id, data);
  }

  // DELETE /users/:id
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // PATCH /users/:id/study-time
  @Patch(':id/study-time')
  addStudyTime(@Param('id') id: string, @Body('minutes') minutes: number) {
    return this.usersService.addStudyTime(id, minutes);
  }
}
