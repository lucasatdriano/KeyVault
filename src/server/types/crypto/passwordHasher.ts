import { Argon2Params } from './argon2';

export interface HashPasswordParams {
    password: string;
    params?: Argon2Params;
}

export interface VerifyPasswordParams {
    password: string;
    hash: string;
}
