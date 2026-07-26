import { NextRequest, NextResponse } from 'next/server';
import { isAuthRoute, isProtectedRoute } from './lib/auth/routes';

const SESSION_COOKIE_NAME = 'session';
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

    if (!hasSession && isProtectedRoute(pathname)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (hasSession && isAuthRoute(pathname)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (hasSession && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|map|txt|xml)).*)',
    ],
};
