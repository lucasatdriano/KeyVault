import {
    AUTH_ROUTES,
    PROTECTED_ROUTES,
    PUBLIC_ROUTES,
} from '../constants/routes';

export function isProtectedRoute(pathname: string) {
    return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

export function isAuthRoute(pathname: string) {
    return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

export function isPublicRoute(pathname: string) {
    return PUBLIC_ROUTES.some((route) => pathname === route);
}
