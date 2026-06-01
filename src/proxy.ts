import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 Proxy (formerly Middleware)
 * - Adds security headers to all responses
 * - Admin route protection is handled by individual page layouts via auth()
 * Note: Admin session check is done in /admin/layout.tsx to avoid
 * database session issues in the proxy layer.
 */
export async function proxy(req: NextRequest) {
  const response = NextResponse.next();

  // Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export default proxy;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|cards|patterns|_next).*)",
  ],
};
