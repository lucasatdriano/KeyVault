import { RECOMMENDED_IV_LENGTH } from '@/src/shared/constants/crypto/aes.constants';

export function validateIV(iv: Uint8Array): void {
    if (!(iv instanceof Uint8Array)) {
        throw new Error('IV deve ser Uint8Array');
    }

    if (iv.length !== RECOMMENDED_IV_LENGTH) {
        throw new Error(`IV deve possuir ${RECOMMENDED_IV_LENGTH} bytes.`);
    }
}
