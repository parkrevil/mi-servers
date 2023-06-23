import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

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
