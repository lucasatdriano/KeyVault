/**
 * Rotas públicas.
 *
 * Não exigem autenticação.
 */
export const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
] as const;

/**
 * Rotas de autenticação.
 *
 * Usuários autenticados não devem acessá-las.
 */
export const AUTH_ROUTES = ['/login', '/register'] as const;

/**
 * Rotas protegidas.
 *
 * Exigem sessão válida.
 */
export const PROTECTED_ROUTES = [
    '/vault',
    '/account',
    '/settings',
    '/devices',
    '/security',
    '/recovery',
    '/audit',
] as const;

/**
 * Verifica se a rota é protegida.
 */
export function isProtectedRoute(pathname: string) {
    return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Verifica se é uma rota de autenticação.
 */
export function isAuthRoute(pathname: string) {
    return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Verifica se é uma rota pública.
 */
export function isPublicRoute(pathname: string) {
    return PUBLIC_ROUTES.some((route) => pathname === route);
}
