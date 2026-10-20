/**
 * Next.js 16 proxy (formerly middleware): fast UX redirect for portal routes when there is no
 * session cookie. This is NOT a security boundary — the API enforces auth on every request and
 * portal layouts call requireRole(). Owner: M2.
 */
import { AUTH_COOKIES } from '@swiftdrop/contracts';
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  if (!req.cookies.has(AUTH_COOKIES.ACCESS)) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/customer/:path*',
    '/merchant/:path*',
    '/courier/:path*',
    '/dispatch/:path*',
    '/admin/:path*',
  ],
};
