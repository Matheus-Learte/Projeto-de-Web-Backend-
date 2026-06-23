import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from './auth.guard';
import { RefreshGuard } from './refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() body: { name: string, username: string; email: string; password: string }) {
    return this.authService.register(body.name, body.username, body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.signIn(body.email, body.password);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  refresh(@Request() req) {
    return this.authService.refresh(req.user.sub, req.user.refreshToken);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Request() req) {
    return this.authService.logout(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.sub);
  }
}
