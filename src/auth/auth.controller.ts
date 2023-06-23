import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos';
import { InvalidAccountException } from './exceptions';
import { JwtTokens } from './interfaces';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto): Promise<JwtTokens> {
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
