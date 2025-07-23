import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle trailing slashes
  if (request.nextUrl.pathname !== '/' && request.nextUrl.pathname.endsWith('/')) {
    return NextResponse.redirect(
      new URL(request.nextUrl.pathname.slice(0, -1), request.url)
    );
  }

  // Handle dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Add any dashboard-specific middleware logic here
    return NextResponse.next();
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};