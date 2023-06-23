import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos';
import { InvalidAccountException } from './exceptions';
import { LoginRo } from './ros';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiCreatedResponse({
    type: LoginRo,
  })
  async login(@Body() body: LoginDto): Promise<LoginRo> {
    const tokens = await this.authService.login(body);

    if (!tokens) {
      throw new InvalidAccountException();
    }

    return tokens;
  }

  @Delete('logout')
  logout(): void {
    //
  }
}
