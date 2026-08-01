export interface HKDFDeriveKeyParams {
    masterKey: Uint8Array;
    salt?: Uint8Array;
    info: Uint8Array;
    length?: number;
}

export interface DeriveVaultKeyParams {
    masterKey: Uint8Array;
    salt?: Uint8Array;
    length?: number;
}

export interface DeriveHmacKeyParams {
    masterKey: Uint8Array;
    salt?: Uint8Array;
    length?: number;
}

export interface DeriveExportKeyParams {
    masterKey: Uint8Array;
    salt?: Uint8Array;
    length?: number;
}
