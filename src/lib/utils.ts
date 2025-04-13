import { Tokens } from '@/enum';
import { TTokens } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Cookies from 'js-cookie';
import { COOKIE_CONFIG } from '@/config';

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
