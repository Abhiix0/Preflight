import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * TODO (auth-integration phase): Re-enable the route protection logic below
 * once GitHub OAuth is wired up end-to-end and the backend is issuing the
 * `preflight_token` cookie on successful login.
 *
 * Until then this middleware is a no-op — all routes including /dashboard
 * and /repositories are directly reachable without a session. This is
 * intentional for the current UI-only development phase.
 */
export function middleware(_req: NextRequest) {
  void _req; // used in commented auth logic below
  // --- DISABLED: auth redirect logic (auth-integration phase) ---
  //
  // const token = _req.cookies.get("preflight_token")?.value;
  // const { pathname } = _req.nextUrl;
  //
  // const isProtectedRoute =
  //   pathname.startsWith("/dashboard") ||
  //   pathname.startsWith("/repositories") ||
  //   pathname.startsWith("/profile") ||
  //   pathname.startsWith("/settings") ||
  //   pathname.startsWith("/docs");
  //
  // const isAuthRoute = pathname === "/login";
  //
  // if (isProtectedRoute && !token) {
  //   return NextResponse.redirect(new URL("/login", _req.url));
  // }
  //
  // if (isAuthRoute && token) {
  //   return NextResponse.redirect(new URL("/dashboard", _req.url));
  // }

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
