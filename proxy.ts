import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Auth routes (permitir que NextAuth funcione)
  const authRoutes = [
    "/api/auth",
    "/api/auth/signin",
    "/api/auth/callback",
    "/api/auth/providers",
    "/api/auth/csrf",
  ];

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Permitir el resto de API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Rutas protegidas
  const protectedRoutes = ["/dashboard", "/onboarding"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Leer cookies de sesión de Auth.js
  const sessionCookie =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token") ??
    request.cookies.get("next-auth.session-token") ??
    request.cookies.get("session");

  if (isProtected && !sessionCookie) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/api/:path*",
    "/login",
    "/",
  ],
};
