import app from './app.config';
import redis from './redis.config';
import server from './server.config';
import typeorm from './typeorm.config';

export const configs = [app, redis, server, typeorm];
export * from './interfaces';
