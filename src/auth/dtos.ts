import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, Length } from 'class-validator';

import { AuthTokensRo } from './ros';

export class LoginDto {
  @ApiProperty({
    format: 'email',
    description: '아이디',
  })
  @IsEmail()
  username: string;

  @ApiProperty({
    description: '비밀번호',
  })
  @IsString()
  password: string;
}

export class RefreshAccessTokenDto extends PickType(AuthTokensRo, ['refreshToken']) {
  @IsUUID('4')
  refreshToken: string;
}
export class LogoutDto extends RefreshAccessTokenDto {}
