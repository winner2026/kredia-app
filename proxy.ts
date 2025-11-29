import { NextRequest, NextResponse } from 'next/server';

export default function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  const authRoutes = [
    '/api/auth',
    '/api/auth/signin',
    '/api/auth/callback',
    '/api/auth/providers',
    '/api/auth/csrf',
  ];

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 2) Permitir cualquier otra API
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 3) Rutas protegidas
  const protectedRoutes = ['/dashboard', '/onboarding'];
  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const sessionCookie =
    req.cookies.get('authjs.session-token') ??
    req.cookies.get('__Secure-authjs.session-token') ??
    req.cookies.get('next-auth.session-token') ??
    req.cookies.get('session');

  if (isProtected && !sessionCookie) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
