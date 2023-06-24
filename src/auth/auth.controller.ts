import { Body, Controller, Delete, Post, UnauthorizedException } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser, Public } from '@/core/decorators';
import { toApiExceptions } from '@/core/helpers';
import { User } from '@/user/user.entity';

import { AuthService } from './auth.service';
import { LoginDto, RefreshAccessTokenDto } from './dtos';
import {
  InvalidAccountException,
  InvalidPasswordException,
  RefreshTokenExpiredException,
  UserNotFoundException,
} from './exceptions';
import { AuthTokensRo } from './ros';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: '로그인',
  })
  @ApiCreatedResponse({
    type: AuthTokensRo,
  })
  @ApiForbiddenResponse({
    description: toApiExceptions(InvalidAccountException),
  })
  async login(@Body() body: LoginDto): Promise<AuthTokensRo> {
    try {
      const tokens = await this.authService.login(body);

      return new AuthTokensRo(tokens);
    } catch (e) {
      switch (e.constructor) {
        case UserNotFoundException:
        case InvalidPasswordException:
          throw new InvalidAccountException();

        default:
          throw e;
      }
    }
  }

  @Delete('logout')
  logout(): void {
    //
  }

  @Public()
  @Post('access-token')
  @ApiOperation({
    summary: 'AccessToken 갱신',
  })
  @ApiCreatedResponse({
    type: AuthTokensRo,
  })
  @ApiForbiddenResponse({
    description: toApiExceptions(InvalidAccountException),
  })
  async refreshAccessToken(@Body() body: RefreshAccessTokenDto): Promise<AuthTokensRo> {
    try {
      const tokens = await this.authService.refreshAccessToken(body.refreshToken);

      return new AuthTokensRo(tokens);
    } catch (e) {
      switch (e.constructor) {
        case RefreshTokenExpiredException:
          throw new UnauthorizedException();

        default:
          throw e;
      }
    }
  }
}
