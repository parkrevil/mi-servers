import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';

import { AppConfig } from '@/core/configs';

import { CreateUserDto } from './dtos';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private argon2Options: argon2.Options;

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {
    const appConfig = this.configService.get<AppConfig>('app');

    this.argon2Options = {
      type: 2,
      salt: Buffer.from(appConfig.userPasswordSalt),
    };
  }

  verifyPassword(hash: string, plain: string): Promise<boolean> {
    return argon2.verify(hash, plain, this.argon2Options);
  }

  async hasUsername(username: string): Promise<boolean> {
    return (await this.userRepo.countBy({ username })) > 0;
  }

  async create(params: CreateUserDto): Promise<User> {
    params.password = await this.encryptPassword(params.password);
    
    const user = new User(params);

    return this.userRepo.save(user);
  }

  findOne(id: number): Promise<User> {
    return this.userRepo.findOneBy({ id });
  }

  findOneByUsername(username: string): Promise<User> {
    return this.userRepo.findOneBy({ username });
  }

  private async encryptPassword(password: string): Promise<string> {
    const hash = await argon2.hash(password, this.argon2Options as any);

    return hash.toString('utf8');
  }
}
