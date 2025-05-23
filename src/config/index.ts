export const COOKIE_CONFIG = {
  expires: 7,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
} as const;
