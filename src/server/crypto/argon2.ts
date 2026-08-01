import { hashRaw } from '@node-rs/argon2';
import { VAULT_KEY_LENGTH } from '@/src/shared/constants/crypto/vault.constants';
import { DEFAULT_ARGON2_PARAMS } from '../../shared/constants/crypto/argon2.constants';
import { Argon2DeriveKeyParams } from '@/src/server/types/crypto/argon2';
import { validatePassword } from '../validators/auth/password.validator';
import {
    validateArgon2Params,
    validateHashLength,
    validateSalt,
} from '../validators/crypto/argon2.validator';

export async function deriveArgon2Key(
    params: Argon2DeriveKeyParams,
): Promise<Uint8Array> {
    try {
        validatePassword(params.password);
        validateSalt(params.salt);

        const hashLength = params.hashLength ?? VAULT_KEY_LENGTH;

        validateHashLength(hashLength);

        const argonParams = params.params ?? DEFAULT_ARGON2_PARAMS;

        validateArgon2Params(argonParams);

        const derived = await hashRaw(params.password, {
            salt: Buffer.from(params.salt),
            outputLen: hashLength,

            memoryCost: argonParams.memoryCost,
            timeCost: argonParams.timeCost,
            parallelism: argonParams.parallelism,
        });

        return new Uint8Array(derived);
    } catch (error) {
        throw new Error(
            `deriveArgon2Key: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        );
    }
}
