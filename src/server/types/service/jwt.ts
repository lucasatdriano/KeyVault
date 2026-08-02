import { JWTPayload } from '@/src/shared/types/jwt-payload';

export interface VerifyTokenResult {
    valid: boolean;
    payload?: JWTPayload;
    error?: string;
}
