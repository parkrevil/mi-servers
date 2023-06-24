import { RedisClientOptions } from '@liaoliaots/nestjs-redis';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { JwtSignOptions } from '@nestjs/jwt';

import { Env } from '../enums';

export interface AppConfig {
  userPasswordSalt: string;
  jwt: {
    secret: string;
    options: Omit<JwtSignOptions, 'secret' | 'privateKey'>;
  };
  refreshToken: {
    ttl: number;
    updateTerm: number;
  };
}

export interface ServerConfig {
  env: Env;
  listen: {
    host: string;
    port: number;
  };
  cors: CorsOptions;
}

export interface RedisConfig {
  auth: RedisClientOptions;
  cache: RedisClientOptions;
}
