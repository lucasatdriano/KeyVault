import { AES_ALGORITHM } from '@/src/shared/constants/crypto/aes.constants';
import { getSubtle, toArrayBuffer } from '@/src/shared/crypto/webcrypto';
import {
    validateCryptoKey,
    validateKeyData,
} from '@/src/shared/validators/crypto/key.validator';
import { validateIV } from '@/src/shared/validators/crypto/aes.validator';
import {
    DecryptParams,
    EncryptParams,
    ExportKeyParams,
    ImportKeyParams,
} from '@/src/shared/types/crypto/aes';

export async function importAESKey(
    params: ImportKeyParams,
): Promise<CryptoKey> {
    validateKeyData(params.keyData);

    const usages: KeyUsage[] = [];

    if (params.encrypt ?? true) {
        usages.push('encrypt');
    }

    if (params.decrypt ?? true) {
        usages.push('decrypt');
    }

    if (usages.length === 0) {
        throw new Error('importAESKey: pelo menos um uso deve ser informado');
    }

    try {
        const subtle = getSubtle();

        return await subtle.importKey(
            'raw',
            toArrayBuffer(params.keyData),
            AES_ALGORITHM,
            params.extractable ?? false,
            usages,
        );
    } catch (error) {
        throw new Error(
            `importAESKey: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        );
    }
}

export async function exportAESKey(
    params: ExportKeyParams,
): Promise<Uint8Array> {
    validateCryptoKey(params.key);

    try {
        const subtle = getSubtle();

        const exported = await subtle.exportKey(
            params.format ?? 'raw',
            params.key,
        );

        return new Uint8Array(exported as ArrayBuffer);
    } catch (error) {
        throw new Error(
            `exportAESKey: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        );
    }
}

export async function encrypt(params: EncryptParams): Promise<Uint8Array> {
    validateCryptoKey(params.key);
    validateIV(params.iv);

    if (!(params.data instanceof Uint8Array)) {
        throw new Error('encrypt: data deve ser Uint8Array');
    }

    if (params.data.length === 0) {
        throw new Error('encrypt: data não pode estar vazio');
    }

    if (
        params.additionalData &&
        !(params.additionalData instanceof Uint8Array)
    ) {
        throw new Error('encrypt: additionalData deve ser Uint8Array');
    }

    const algorithm: AesGcmParams = {
        name: AES_ALGORITHM.name,
        iv: toArrayBuffer(params.iv),
        tagLength: 128,
        ...(params.additionalData && {
            additionalData: toArrayBuffer(params.additionalData),
        }),
    };

    try {
        const subtle = getSubtle();

        const ciphertext = await subtle.encrypt(
            algorithm,
            params.key,
            toArrayBuffer(params.data),
        );

        return new Uint8Array(ciphertext);
    } catch (error) {
        throw new Error(
            `encrypt: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        );
    }
}

export async function decrypt(params: DecryptParams): Promise<Uint8Array> {
    validateCryptoKey(params.key);
    validateIV(params.iv);

    if (!(params.ciphertext instanceof Uint8Array)) {
        throw new Error('decrypt: ciphertext deve ser Uint8Array');
    }

    if (params.ciphertext.length < 17) {
        throw new Error('decrypt: ciphertext inválido');
    }

    if (
        params.additionalData &&
        !(params.additionalData instanceof Uint8Array)
    ) {
        throw new Error('decrypt: additionalData deve ser Uint8Array');
    }

    const algorithm: AesGcmParams = {
        name: AES_ALGORITHM.name,
        iv: toArrayBuffer(params.iv),
        tagLength: 128,
        ...(params.additionalData && {
            additionalData: toArrayBuffer(params.additionalData),
        }),
    };

    try {
        const subtle = getSubtle();

        const plaintext = await subtle.decrypt(
            algorithm,
            params.key,
            toArrayBuffer(params.ciphertext),
        );

        return new Uint8Array(plaintext);
    } catch (error) {
        throw new Error(
            `decrypt: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        );
    }
}
