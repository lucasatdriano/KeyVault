export const SESSION_COOKIE_NAME = 'session';

export const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 dias
export const REMEMBER_DURATION = 60 * 60 * 24 * 30; // 30 dias

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
};
