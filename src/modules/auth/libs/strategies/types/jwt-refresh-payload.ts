export type JwtRefreshPayloadType = {
  id: string;
  refreshToken: string;
  iat: number;
  exp: number;
};
