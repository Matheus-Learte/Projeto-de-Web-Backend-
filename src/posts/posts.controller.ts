import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}


  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.postsService.findByUser(id);
  }

  @Post()
  create(
    @Body()
    body: {
      content: string;
      authorId: string;
    },
  ) {
    return this.postsService.create(body);
  }

  @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findById(id);
  }
  
  @Put(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.postsService.update(id, data);
  }
  
  @Delete(':id')
    delete(@Param('id') id: string) {
        return this.postsService.remove(id);
  }
}