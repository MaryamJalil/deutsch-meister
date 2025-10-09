// Application-wide constants
export const APP_CONSTANTS = {
  JWT_EXPIRES_IN: '7d',
  BCRYPT_ROUNDS: 10,
  DEFAULT_PORT: 3000,
} as const;

export const LANGUAGE_LEVELS = {
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
  C2: 'C2',
} as const;

export type LanguageLevel =
  (typeof LANGUAGE_LEVELS)[keyof typeof LANGUAGE_LEVELS];
