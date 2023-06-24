import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AuthModule } from './auth/auth.module';
import { configs, RedisConfig } from './core/configs';
import { AuthGuard } from './core/guards/auth';
import { isLocal } from './core/helpers';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: isLocal() ? 'debug' : 'info',
        redact: ['request.headers.authorization'],
        transport: isLocal() ? { target: 'pino-pretty' } : undefined,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get<TypeOrmModuleOptions>('typeorm');

        return Object.assign(config, {
          namingStrategy: new SnakeNamingStrategy(),
          autoLoadEntities: true,
        });
      },
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get<RedisConfig>('redis');

        return {
          config: [config.auth, config.cache],
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class RootModule {}
