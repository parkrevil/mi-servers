import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { JwtSignOptions } from '@nestjs/jwt';

import { Env } from '../enums';

export interface AppConfig {
  userPasswordSalt: string;
  jwt: {
    secret: string;
    options: Omit<JwtSignOptions, 'secret' | 'privateKey'>;
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
