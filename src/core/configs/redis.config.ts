import { registerAs } from '@nestjs/config';

import { InjectTokens } from '../enums';
import { RedisConfig } from '.';

export default registerAs(
  'redis',
  (): RedisConfig => ({
    auth: {
      namespace: InjectTokens.RedisAuthClient,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_AUTH_DB, 10),
    },
    cache: {
      namespace: InjectTokens.RedisCacheClient,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_CACHE_DB, 10),
    },
  }),
);
