import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { isLocal } from '../helpers';

export default registerAs(
  'typeorm',
  (): TypeOrmModuleOptions => ({
    type: process.env.TYPEORM_CONNECTION as any,
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT, 10),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    logging: isLocal() ? true : ['error', 'warn'],
    entities: process.env.TYPEORM_ENTITIES.split(','),
    timezone: process.env.TYPEORM_TIMEZONE,
  }),
);
