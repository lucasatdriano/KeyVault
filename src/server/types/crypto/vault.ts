import { Argon2Params } from './argon2';

export interface EncryptedVault {
    version: number;
    ciphertext: string;
    iv: string;
    salt: string;
    argon2: Argon2Params;
}
