import { ApiProperty } from '@nestjs/swagger';
import { JwtTokens } from './interfaces';

export class LoginRo implements Pick<JwtTokens, 'accessToken'> {
  @ApiProperty({
    description: 'JWT Access Token(in Header - Authorization: Bearer xxx)',
  })
  accessToken: string;

  constructor(tokens: JwtTokens) {
    this.accessToken = tokens.accessToken;
  }
}
