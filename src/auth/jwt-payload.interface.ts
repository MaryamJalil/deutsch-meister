export interface JwtPayload {
  sub: number;
  email: string;
  role?: 'user' | 'admin';
  iat?: number;
  exp?: number;
}
