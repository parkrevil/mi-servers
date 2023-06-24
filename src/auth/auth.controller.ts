import { Body, Controller, Delete, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '@/core/decorators/public';
import { toApiExceptions } from '@/core/helpers';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos';
import { InvalidAccountException } from './exceptions';
import { LoginRo } from './ros';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiCreatedResponse({
    type: LoginRo,
  })
  @ApiForbiddenResponse({
    description: toApiExceptions(InvalidAccountException),
  })
  async login(@Body() body: LoginDto): Promise<LoginRo> {
    const tokens = await this.authService.login(body);

    if (!tokens) {
      throw new InvalidAccountException();
    }

    return new LoginRo(tokens);
  }

  @Delete('logout')
  logout(): void {
    //
  }
}
