export const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
] as const;

export const AUTH_ROUTES = ['/login', '/register'] as const;

export const PROTECTED_ROUTES = [
    '/dashboard',
    '/dashboard/favorites',
    '/dashboard/trash',
    '/account',
    '/account/recovery',
    '/account/audit',
    '/account/settings',
] as const;
