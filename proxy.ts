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

  // Rutas protegidas (vacío para permitir acceso libre)
  const protectedRoutes: string[] = [];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    return NextResponse.next();
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
