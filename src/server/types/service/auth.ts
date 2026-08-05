import { EncryptedVault } from '@/src/shared/types/crypto/vault';

export interface VerifyEmailData {
    userId: string;
    token: string;
}

export interface RegisterCategoryData {
    cipherText: string;
    iv: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    userAgent?: string;
    sessionExpiration?: number;
    encryptedVaultKey: EncryptedVault;
    categories: RegisterCategoryData[];
}

export interface LoginData {
    email: string;
    password: string;
    userAgent?: string;
    sessionExpiration?: number;
}

export interface ChangePasswordData {
    userId: string;
    currentPassword: string;
    newPassword: string;
}

export interface RegisterResult {
    user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
    };
}

export interface LoginResult {
    user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
    };
    encryptedVaultKey: EncryptedVault;
}

export interface ChangePasswordResult {
    success: boolean;
    message: string;
}
