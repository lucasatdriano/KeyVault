import { Argon2Params } from '@/src/shared/types/crypto/argon2';

export interface EncryptedVault {
    version: number;
    ciphertext: string;
    iv: string;
    salt: string;
    argon2: Argon2Params;
}
