export interface ImportKeyParams {
    keyData: Uint8Array;
    extractable?: boolean;
    encrypt?: boolean;
    decrypt?: boolean;
}

export interface EncryptParams {
    key: CryptoKey;
    data: Uint8Array;
    iv: Uint8Array;
    additionalData?: Uint8Array;
}

export interface DecryptParams {
    key: CryptoKey;
    ciphertext: Uint8Array;
    iv: Uint8Array;
    additionalData?: Uint8Array;
}

export interface ExportKeyParams {
    key: CryptoKey;
    format?: 'raw';
}
