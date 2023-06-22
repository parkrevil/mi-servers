import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

class UserDto {
  @ApiProperty({
    format: 'email',
    description: '아이디',
  })
  @IsEmail()
  username: string;
}

export class HasUsernameQuery extends PickType(UserDto, ['username']) {}

export class CreateUserDto extends PickType(UserDto, ['username']) {
  @ApiProperty({
    description: '비밀번호',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: '닉네임',
  })
  nickname: string;
}
