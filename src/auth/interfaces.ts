export interface JwtPayload {
  id: number;
}

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}
