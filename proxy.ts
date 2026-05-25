import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/admin/login';

  // Belum login → redirect ke halaman login
  if (!isLoginPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Sudah login → jangan masuk halaman login lagi
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
