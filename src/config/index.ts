export const COOKIE_CONFIG = {
  expires: 90,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
} as const;
