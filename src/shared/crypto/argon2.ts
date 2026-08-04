import { argon2id } from 'hash-wasm';
import { VAULT_KEY_LENGTH } from '@/src/shared/constants/crypto/vault.constants';
import { DEFAULT_ARGON2_PARAMS } from '../../shared/constants/crypto/argon2.constants';
import { Argon2DeriveKeyParams } from '../types/crypto/argon2';
import {
    validateArgon2Params,
    validateHashLength,
    validateSalt,
} from '../validators/crypto/argon2.validator';
import { validatePassword } from '@/src/shared/validators/auth/password.validator';

export async function deriveArgon2Key(
    params: Argon2DeriveKeyParams,
): Promise<Uint8Array> {
    validatePassword(params.password);
    validateSalt(params.salt);

    const hashLength = params.hashLength ?? VAULT_KEY_LENGTH;

    validateHashLength(hashLength);

    const argonParams = params.params ?? DEFAULT_ARGON2_PARAMS;

    validateArgon2Params(argonParams);

    const derived = await argon2id({
        password: params.password,
        salt: params.salt,
        parallelism: argonParams.parallelism,
        iterations: argonParams.timeCost,
        memorySize: argonParams.memoryCost,
        hashLength,
        outputType: 'binary',
    });

    return derived;
}
