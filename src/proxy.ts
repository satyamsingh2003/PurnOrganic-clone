import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('customer_token')?.value;
  const { pathname } = request.nextUrl;

  // If user has a token and tries to go to login, redirect instantly to /account
  if (token && pathname === '/account/login') {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  // If user does not have a token and tries to access protected /account routes, redirect to login
  if (!token && pathname.startsWith('/account') && pathname !== '/account/login') {
    return NextResponse.redirect(new URL('/account/login', request.url));
  }

  return NextResponse.next();
}

// Only run middleware on /account routes
export const config = {
  matcher: ['/account/:path*']
};
