import { AES_ALGORITHM } from '@/src/shared/constants/crypto/aes.constants';
import {
    MAX_DERIVED_KEY_LENGTH,
    MIN_DERIVED_KEY_LENGTH,
    MIN_MASTER_KEY_LENGTH,
} from '@/src/shared/constants/crypto/key.constants';

export function validateMasterKey(key: Uint8Array): void {
    if (!(key instanceof Uint8Array)) {
        throw new Error('masterKey deve ser Uint8Array');
    }

    if (key.length < MIN_MASTER_KEY_LENGTH) {
        throw new Error(
            `masterKey deve possuir pelo menos ${MIN_MASTER_KEY_LENGTH} bytes.`,
        );
    }
}

export function validateKeyLength(length: number): void {
    if (!Number.isInteger(length) || length <= 0) {
        throw new Error(
            `length deve ser um inteiro positivo. Recebido: ${length}`,
        );
    }

    if (length < MIN_DERIVED_KEY_LENGTH) {
        throw new Error(`length mínimo: ${MIN_DERIVED_KEY_LENGTH}`);
    }

    if (length > MAX_DERIVED_KEY_LENGTH) {
        throw new Error(`length máximo: ${MAX_DERIVED_KEY_LENGTH}`);
    }
}

export function validateKeyData(keyData: Uint8Array): void {
    if (!(keyData instanceof Uint8Array)) {
        throw new Error('keyData deve ser Uint8Array');
    }

    if (keyData.length !== 32) {
        throw new Error('AES-256 requer uma chave de 32 bytes.');
    }
}

export function validateCryptoKey(key: CryptoKey): void {
    if (!(key instanceof CryptoKey)) {
        throw new Error('CryptoKey inválida');
    }

    if (key.type !== 'secret') {
        throw new Error('A chave deve ser do tipo secret');
    }

    if (key.algorithm.name !== AES_ALGORITHM.name) {
        throw new Error('A chave deve utilizar AES-GCM');
    }
}
