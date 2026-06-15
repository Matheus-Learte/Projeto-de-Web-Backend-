import { Body, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findAll().then(users =>
      users.find(u => u.id === Number(id))
    );
  }

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
    }
}