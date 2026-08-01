export const DEFAULT_ARGON2_PARAMS = {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 2,
};

export const DEFAULT_HASH_LENGTH = 32;

export const MIN_HASH_LENGTH = 16;
export const MAX_HASH_LENGTH = 1024;

export const MIN_SALT_LENGTH = 16;
export const MAX_SALT_LENGTH = 1024;

export const ALGORITHM_NAME = 'Argon2id';
