import { registerAs } from '@nestjs/config';

import { Env } from '../enums';
import { ServerConfig } from './interfaces';

export default registerAs(
  'server',
  (): ServerConfig => ({
    env: process.env.NODE_ENV as Env,
    listen: {
      host: process.env.LISTEN_HOST,
      port: parseInt(process.env.LISTEN_PORT, 10),
    },
    cors: {
      origin: process.env.CORS_ORIGIN.split(',').map((regexp) => {
        return new RegExp(regexp);
      }),
      methods: process.env.CORS_METHODS.split(','),
      allowedHeaders: process.env.CORS_ALLOWED_HEADERS.split(','),
      exposedHeaders: process.env.CORS_EXPOSED_HEADERS.split(','),
      preflightContinue: process.env.CORS_PREFLIGHT_CONTINUE === 'true',
      credentials: process.env.CORS_CREDENTIALS === 'true',
      optionsSuccessStatus: parseInt(
        process.env.CORS_OPTIONS_SUCCESS_STATUS,
        10,
      ),
    },
  }),
);
