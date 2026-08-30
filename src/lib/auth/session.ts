import { NextResponse } from 'next/server';
import { AuthTokens } from '@/types/auth';

const IS_PROD = process.env.NODE_ENV === 'production';

export function attachAuthCookies(response: NextResponse, tokens: AuthTokens): NextResponse {
  // Access Token: 15 minutos (900s)
  response.cookies.set('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'strict',
    path: '/',
    maxAge: 900,
  });

  // Refresh Token: 30 dias (2592000s)
  response.cookies.set('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'strict',
    path: '/',
    maxAge: 2592000,
  });

  return response;
}

export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
  return response;
}
