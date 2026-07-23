import { randomBytes } from 'crypto';

export function generateSessionToken(): string {
    return randomBytes(64).toString('hex');
}
