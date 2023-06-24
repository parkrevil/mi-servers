import { DateTime } from 'luxon';

export interface JwtPayload {
  id: number;
}

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenPayload {
  userId: number;
  updateAt: DateTime;
}
