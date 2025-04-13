import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';


import type { NextRequest } from 'next/server';
import { Tokens } from './enum';

export async function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get(Tokens.REFRESH);
  const pathName = req.nextUrl.pathname;
  const isAuthRoute = pathName === '/login' || pathName === '/signup';

  if (refreshToken) {
    try {
      const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);
      await jwtVerify(refreshToken.value, secret);

      if (isAuthRoute) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL('/login', req.url));

      response.cookies.set(Tokens.ACCESS, '', {
        expires: new Date(0),
        path: '/',
      });
      response.cookies.set(Tokens.REFRESH, '', {
        expires: new Date(0),
        path: '/',
      });

      console.error('Invalid token:', error);
      return response;
    }
  }

  if (!refreshToken && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/signup', '/:roomId'],
};
