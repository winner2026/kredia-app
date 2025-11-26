import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { buildCsp } from "@/lib/security/csp";
import { getRequestId } from "@/lib/observability/request";

const mutatingMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const protectedPaths = ["/dashboard"];
const bypassPaths: string[] = ["/api/webhooks"];

function shouldBypass(pathname: string) {
  return bypassPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function applySecurityHeaders(response: NextResponse, requestId: string) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "0");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Content-Security-Policy", buildCsp());
  response.headers.set("X-Request-ID", requestId);
  response.headers.set("x-sentry-trace", requestId);
}

export async function middleware(req: NextRequest) {
  const requestId = getRequestId(req);
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-request-id", requestId);
  requestHeaders.set("x-sentry-trace", requestId);

  const { pathname } = req.nextUrl;
  const isProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isMutating = mutatingMethods.has(req.method) && pathname.startsWith("/api/") && !shouldBypass(pathname);

  const session = await auth();

  if (isProtected && !session) {
    const signInUrl = new URL("/login", req.nextUrl.origin);
    signInUrl.searchParams.set("from", req.nextUrl.pathname);
    const redirectRes = NextResponse.redirect(signInUrl);
    applySecurityHeaders(redirectRes, requestId);
    return redirectRes;
  }

  if (isMutating && !session) {
    const res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    applySecurityHeaders(res, requestId);
    return res;
  }

  // detección básica de abuso: UA sospechoso / paths de escaneo
  const ua = req.headers.get("user-agent") || "";
  if (ua.toLowerCase().includes("sqlmap") || ua.toLowerCase().includes("nikto")) {
    const res = NextResponse.json({ error: "Forbidden" }, { status: 403 });
    applySecurityHeaders(res, requestId);
    return res;
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  applySecurityHeaders(response, requestId);
  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
