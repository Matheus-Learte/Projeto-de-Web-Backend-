import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(username: string, email: string, password: string) {
    const user = this.repository.create({ username, email, password });
    return this.repository.save(user);
  }

  async findAll() {
    return this.repository.find();
  }

  async findByUsername(username: string) {
    return this.repository.findOne({ where: { username } });
  }

  async findById(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  async updateRefreshToken(id: number, hashedToken: string | null) {
    await this.repository.update(id, { refreshToken: hashedToken });
  }
}
