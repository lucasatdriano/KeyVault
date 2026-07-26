export const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
] as const;

export const AUTH_ROUTES = ['/login', '/register'] as const;

export const PROTECTED_ROUTES = [
    // '/dashboard',
    // '/dashboard/favorites',
    // '/dashboard/trash',
    // '/account',
    // '/account/settings',
    // '/account/security',
    // '/account/recovery',
    // '/account/audit',
] as const;
