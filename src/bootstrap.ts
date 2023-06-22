import compression from '@fastify/compress';
import fastifyHelmet from '@fastify/helmet';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';

import { ServerConfig } from './core/configs';
import { ValidationException } from './core/exceptions';
import { isLocal } from './core/helpers';
import { RootModule } from './root.module';

export const bootstrap = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    RootModule,
    new FastifyAdapter({
      genReqId: () => uuidv4(),
      requestIdHeader: false,
    }),
    {
      bufferLogs: true,
    },
  );

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      dismissDefaultMessages: true,
      validationError: {
        target: true,
        value: false,
      },
      forbidUnknownValues: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new ValidationException();
      },
    }),
  );

  const serverConfig = app.get(ConfigService).get<ServerConfig>('server');

  await app.register(compression);
  app.enableCors(serverConfig.cors);
  await app.register(fastifyHelmet);

  if (isLocal()) {
    const apiDoc = new DocumentBuilder()
      .setTitle('mi')
      .setVersion('0.0')
      .addBearerAuth()
      .addTag('인증')
      .addTag('사용자')
      .build();
    const document = SwaggerModule.createDocument(app, apiDoc);

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        docExpansion: 'none',
      },
    });
  }

  await app.listen(serverConfig.listen.port, serverConfig.listen.host);
};
