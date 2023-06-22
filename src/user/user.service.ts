import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dtos';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async hasUsername(username: string): Promise<boolean> {
    return (await this.userRepo.countBy({ username })) > 0;
  }

  async create(params: CreateUserDto): Promise<User> {
    const user = new User(params);

    await this.userRepo.insert(user);

    return user;
  }
}
