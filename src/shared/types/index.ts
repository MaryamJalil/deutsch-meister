// Common types and interfaces used across the application
export interface DatabaseConfig {
  url: string;
}

export interface JWTConfig {
  secret: string;
  expiresIn: string;
}

export interface AuthPayload {
  sub: number;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  user?: {
    id: number;
    email: string;
    name?: string | null;
  };
}
