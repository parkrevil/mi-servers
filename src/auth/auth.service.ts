import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

import { AppConfig } from '@/core/configs';
import { InjectTokens } from '@/core/enums';
import { User } from '@/user/user.entity';
import { UserService } from '@/user/user.service';

import { LoginDto } from './dtos';
import { InvalidPasswordException, RefreshTokenExpiredException, UserNotFoundException } from './exceptions';
import { JwtPayload, JwtTokens, RefreshTokenPayload } from './interfaces';

@Injectable()
export class AuthService {
  private readonly REFRESH_TOKEN_TTL: number;
  private readonly REFRESH_TOKEN_UPDATE_TERM: number;

  constructor(
    @InjectRedis(InjectTokens.RedisAuthClient)
    private redis: Redis,
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    const config = this.configService.get<AppConfig>('app');

    this.REFRESH_TOKEN_TTL = config.refreshToken.ttl;
    this.REFRESH_TOKEN_UPDATE_TERM = config.refreshToken.updateTerm;
  }

  async login(params: LoginDto): Promise<JwtTokens> {
    const user = await this.userService.findOneByUsername(params.username);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (!(await this.userService.verifyPassword(user.password, params.password))) {
      throw new InvalidPasswordException();
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();

    await this.setRefreshToken(user, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.deleteRefreshToken(refreshToken);
  }

  async refreshAccessToken(oldRefreshToken: string): Promise<JwtTokens> {
    let refreshToken = oldRefreshToken;
    const payload = await this.getRefreshToken(oldRefreshToken);

    if (!payload) {
      throw new RefreshTokenExpiredException();
    }

    const user = await this.userService.findOne(payload.userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (payload.updateAt <= DateTime.local()) {
      refreshToken = this.generateRefreshToken();

      await Promise.all([this.deleteRefreshToken(oldRefreshToken), this.setRefreshToken(user, refreshToken)]);
    }

    const accessToken = await this.generateAccessToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = { id: user.id };

    return this.jwtService.signAsync(payload);
  }

  private generateRefreshToken(): string {
    return uuidv4();
  }

  private async setRefreshToken(user: User, refreshToken: string): Promise<void> {
    const val: RefreshTokenPayload = {
      userId: user.id,
      updateAt: DateTime.local().plus({ milliseconds: this.REFRESH_TOKEN_UPDATE_TERM }),
    };

    await this.redis.set(refreshToken, JSON.stringify(val), 'PX', this.REFRESH_TOKEN_TTL);
  }

  private async getRefreshToken(refreshToken: string): Promise<RefreshTokenPayload> {
    const val = await this.redis.get(refreshToken);

    if (!val) {
      return;
    }

    const res = JSON.parse(val);

    res.updateAt = DateTime.fromISO(res.updateAt);

    return res;
  }

  private async deleteRefreshToken(refreshToken: string): Promise<void> {
    await this.redis.del(refreshToken);
  }
}
