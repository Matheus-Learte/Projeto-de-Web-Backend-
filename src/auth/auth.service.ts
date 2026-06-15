import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return this.usersService.create(username, email, hashed);
  }

  private async generateTokens(userId: number, username: string, role: string) {
    const payload = { username, sub: userId, role };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.refreshSecret,
        expiresIn: '7d',
      }),
    ]);
    const hashed = await bcrypt.hash(refresh_token, 10);
    await this.usersService.updateRefreshToken(userId, hashed);
    return { access_token, refresh_token };
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.generateTokens(user.id, user.username, user.role);
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user?.refreshToken || !(await bcrypt.compare(refreshToken, user.refreshToken))) {
      throw new UnauthorizedException();
    }
    return this.generateTokens(user.id, user.username, user.role);
  }

  async logout(userId: number) {
    await this.usersService.updateRefreshToken(userId, null);
  }
}