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
    currentPassword: string;
    newPassword: string;
}

export interface ChangeEmailData {
    newEmail: string;
    password: string;
}

export interface RegisterResult {
    user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
    };
    verificationToken: string;
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

export interface VerifyEmailResult {
    userId: string;
    requiresLogout: boolean;
}

export interface ChangePasswordResult {
    success: boolean;
    message: string;
}
