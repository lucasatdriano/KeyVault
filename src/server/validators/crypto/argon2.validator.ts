import {
    MAX_HASH_LENGTH,
    MAX_SALT_LENGTH,
    MIN_HASH_LENGTH,
    MIN_SALT_LENGTH,
} from '@/src/shared/constants/crypto/argon2.constants';
import { Argon2Params } from '@/src/server/types/crypto/argon2';

export function validateSalt(salt: Uint8Array): void {
    if (!(salt instanceof Uint8Array)) {
        throw new Error('salt deve ser Uint8Array');
    }

    if (salt.length < MIN_SALT_LENGTH) {
        throw new Error(
            `Salt deve possuir no mínimo ${MIN_SALT_LENGTH} bytes.`,
        );
    }

    if (salt.length > MAX_SALT_LENGTH) {
        throw new Error(
            `Salt deve possuir no máximo ${MAX_SALT_LENGTH} bytes.`,
        );
    }
}

export function validateHashLength(length: number): void {
    if (!Number.isInteger(length)) {
        throw new Error('hashLength deve ser inteiro');
    }

    if (length < MIN_HASH_LENGTH) {
        throw new Error(`hashLength mínimo: ${MIN_HASH_LENGTH}`);
    }

    if (length > MAX_HASH_LENGTH) {
        throw new Error(`hashLength máximo: ${MAX_HASH_LENGTH}`);
    }
}

export function validateArgon2Params(params: Argon2Params): void {
    if (!Number.isInteger(params.memoryCost) || params.memoryCost < 8192) {
        throw new Error('memoryCost inválido');
    }

    if (!Number.isInteger(params.timeCost) || params.timeCost < 2) {
        throw new Error('timeCost inválido');
    }

    if (
        !Number.isInteger(params.parallelism) ||
        params.parallelism < 1 ||
        params.parallelism > 16
    ) {
        throw new Error('parallelism inválido');
    }
}
