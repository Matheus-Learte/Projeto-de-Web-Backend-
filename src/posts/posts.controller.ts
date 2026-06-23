import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() dto: CreatePostDto) {
    return this.postsService.create(dto);
  }

  // 👇 agora recebe userId opcional
  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.postsService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ) {
    return this.postsService.findOne(id, userId);
  }

  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.postsService.findByUser(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, dto);
  }

  @Patch(':id/like')
  toggleLike(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    return this.postsService.toggleLike(id, body.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @Delete('user/:id')
  removeByUser(@Param('id') id: string) {
    return this.postsService.removeByUser(id);
  }
}