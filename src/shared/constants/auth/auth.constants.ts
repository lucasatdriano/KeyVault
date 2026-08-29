export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ACCESS_TOKEN_DURATION = {
    MINUTES_30: 30 * 60,
    HOUR_1: 60 * 60,
    HOURS_2: 2 * 60 * 60,
} as const;

export const JWT_ALGORITHM = {
    name: 'HMAC',
    hash: 'SHA-256',
} satisfies HmacImportParams;
