import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("preflight_token")?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes (everything under /dashboard, /repositories, etc.)
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/repositories") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/docs");

  const isAuthRoute = pathname === "/login";

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (auth page)
     * - auth (auth callbacks)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|auth).*)",
  ],
};
