import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Handle /dashboard route redirection
  if (pathname === '/dashboard') {
    // Properly encode the workspace name to handle spaces
    url.pathname = `/dashboard/${encodeURIComponent('My workspace')}`;
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard'],
};