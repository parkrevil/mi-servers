import { ApiProperty } from '@nestjs/swagger';

import { JwtTokens } from './interfaces';

export class AuthTokensRo implements JwtTokens {
  @ApiProperty({
    description: 'JWT Access Token(in Header - Authorization: Bearer xxx)',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh Token',
  })
  refreshToken: string;

  constructor(tokens: JwtTokens) {
    Object.assign<AuthTokensRo, JwtTokens>(this, tokens);
  }
}
