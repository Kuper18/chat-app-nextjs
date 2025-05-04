import { clsx, type ClassValue } from 'clsx';
import Cookies from 'js-cookie';
import { twMerge } from 'tailwind-merge';

import { COOKIE_CONFIG } from '@/config';
import { Tokens } from '@/enum';
import { TTokens } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const setCookies = ({ accessToken, refreshToken }: TTokens): void => {
  Cookies.set(Tokens.ACCESS, accessToken, COOKIE_CONFIG);
  Cookies.set(Tokens.REFRESH, refreshToken, COOKIE_CONFIG);
};

export const removeCookies = (): void => {
  Cookies.remove(Tokens.ACCESS, { path: '/' });
  Cookies.remove(Tokens.REFRESH, { path: '/' });
};

export const parseJwt = (): { id: number; iat: number; exp: number } | null => {
  const token = Cookies.get(Tokens.ACCESS);

  if (!token) {
    return null;
  }

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const getQueryString = (
  params: Record<string, string | number | undefined>,
): string => {
  return new URLSearchParams(
    Object.entries(params)
      .filter((param) => param[1])
      .map(([key, value]) => [key, String(value)]),
  ).toString();
};
