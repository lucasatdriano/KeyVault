import { EncryptedField } from '../../types/crypto/cipher';

export function validateEncrypt(value: string, vaultKey: Uint8Array): void {
    if (typeof value !== 'string') {
        throw new Error('encryptString: value deve ser uma string.');
    }

    if (!value.trim()) {
        throw new Error('encryptString: value não pode estar vazio.');
    }

    if (!(vaultKey instanceof Uint8Array)) {
        throw new Error('encryptString: vaultKey deve ser um Uint8Array.');
    }
}

export function validateDecrypt(
    encrypted: EncryptedField,
    vaultKey: Uint8Array,
): void {
    if (typeof encrypted !== 'object' || encrypted === null) {
        throw new Error('decryptString: encrypted deve ser um objeto.');
    }

    if (typeof encrypted.cipherText !== 'string') {
        throw new Error('decryptString: cipherText deve ser uma string.');
    }

    if (typeof encrypted.iv !== 'string') {
        throw new Error('decryptString: iv deve ser uma string.');
    }

    if (!(vaultKey instanceof Uint8Array)) {
        throw new Error('decryptString: vaultKey deve ser um Uint8Array.');
    }
}
