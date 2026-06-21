import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // REGISTER
  async register(name: string, username: string, email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.usersService.create({
      name,
      username,
      email,
      password: hashedPassword,
    });
  }

  // LOGIN
  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.username);
  }

  // TOKENS
  private async generateTokens(userId: string, username: string) {
    const payload = {
      sub: userId,
      username,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: '7d',
    });

    const hashedRefresh = await bcrypt.hash(refresh_token, 10);

    await this.usersService.updateRefreshToken(userId, hashedRefresh);

    return {
      access_token,
      refresh_token,
    };
  }

  // REFRESH
  async refresh(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);

    if (!user?.refreshToken) {
      throw new UnauthorizedException();
    }

    const valid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!valid) {
      throw new UnauthorizedException();
    }

    return this.generateTokens(user.id, user.username);
  }

  // LOGOUT
  async logout(userId: string) {
    return this.usersService.updateRefreshToken(userId, null);
  }
}