import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AuthModule } from './auth/auth.module';
import { AppConfig, configs } from './core/configs';
import { isLocal } from './core/helpers';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './core/guards/auth';
import { JwtModule } from '@nestjs/jwt';

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
