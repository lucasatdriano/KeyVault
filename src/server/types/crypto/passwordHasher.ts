import { Argon2Params } from '@/src/shared/types/crypto/argon2';

export interface HashPasswordParams {
    password: string;
    params?: Argon2Params;
}

export interface VerifyPasswordParams {
    password: string;
    hash: string;
}
