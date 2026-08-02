import { NextRequest, NextResponse } from 'next/server';
import { isAuthRoute, isProtectedRoute } from './server/auth/routes';
import { ACCESS_TOKEN_COOKIE_NAME } from './shared/constants/auth/cookies.constants';
import { verifyEdgeToken } from './server/auth/verify-edge-token';
import { handleExpiredSession } from './server/auth/logout-expired';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

    const session = token ? await verifyEdgeToken(token) : null;

    if (session?.expired && session.payload) {
        return handleExpiredSession(request, session.payload.sub);
    }

    const hasSession = session?.valid ?? false;

    if (!hasSession && isProtectedRoute(pathname)) {
        const response = NextResponse.redirect(new URL('/login', request.url));

        response.cookies.delete(ACCESS_TOKEN_COOKIE_NAME);

        return response;
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
