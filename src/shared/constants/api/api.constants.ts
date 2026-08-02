export const INTERNAL_API = {
    HEADER: 'authorization',
    TOKEN_PREFIX: 'Bearer',
} as const;

export const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET!;
