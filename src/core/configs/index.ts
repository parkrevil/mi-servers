import app from './app.config';
import server from './server.config';
import typeorm from './typeorm.config';

export const configs = [app, server, typeorm];
export * from './interfaces';
