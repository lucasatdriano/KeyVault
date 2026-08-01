export interface Argon2Params {
    memoryCost: number;
    timeCost: number;
    parallelism: number;
}

export interface Argon2DeriveKeyParams {
    password: string;
    salt: Uint8Array;
    hashLength?: number;
    params?: Argon2Params;
}
