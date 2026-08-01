import { hash, verify } from '@node-rs/argon2';
import { DEFAULT_ARGON2_PARAMS } from '@/src/shared/constants/crypto/argon2.constants';
import { validatePassword } from '../validators/auth/password.validator';
import { validateArgon2Params } from '../validators/crypto/argon2.validator';
import {
    HashPasswordParams,
    VerifyPasswordParams,
} from '@/src/server/types/crypto/passwordHasher';

export async function hashPassword(
    params: HashPasswordParams,
): Promise<string> {
    try {
        validatePassword(params.password);

        const argonParams = params.params ?? DEFAULT_ARGON2_PARAMS;

        validateArgon2Params(argonParams);

        return hash(params.password, {
            memoryCost: argonParams.memoryCost,
            timeCost: argonParams.timeCost,
            parallelism: argonParams.parallelism,
        });
    } catch (error) {
        throw new Error(
            `hashPassword: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        );
    }
}

export async function verifyPassword(
    params: VerifyPasswordParams,
): Promise<boolean> {
    validatePassword(params.password);

    if (!params.hash) {
        throw new Error('verifyPassword: hash inválido');
    }

    return verify(params.hash, params.password);
}
