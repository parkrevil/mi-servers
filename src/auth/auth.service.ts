import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { AppConfig } from '@/core/configs';
import { UserService } from '@/user/user.service';

import { LoginDto } from './dtos';
import { JwtPayload, JwtTokens } from './interfaces';

@Injectable()
export class AuthService {
  jwtConfig: JwtSignOptions;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    const appConfig = this.configService.get<AppConfig>('app');

    this.jwtConfig = appConfig.jwt;
  }

  async login(params: LoginDto): Promise<JwtTokens> {
    const user = await this.userService.findOneByUsername(params.username);

    if (!user) {
      return undefined;
    }

    if (
      !(await this.userService.verifyPassword(user.password, params.password))
    ) {
      return undefined;
    }

    const payload: JwtPayload = { id: user.id };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '10s' }),
      this.jwtService.signAsync(payload, { expiresIn: '1m' }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
