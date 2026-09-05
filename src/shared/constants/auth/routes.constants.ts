export const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/forgot-password/recovery',
    '/forgot-password/reset-password',
    '/verify-email',
    '/legal/terms',
    '/legal/privacy',
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
