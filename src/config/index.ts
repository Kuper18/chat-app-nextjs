export const COOKIE_CONFIG = {
  expires: 7,
  path: '/',
  secure:
    typeof window !== 'undefined' && window.location.protocol === 'https:',
  sameSite: 'strict',
} as const;
