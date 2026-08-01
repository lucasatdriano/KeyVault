export interface RegisterData {
    name: string;
    email: string;
    password: string;
    userAgent?: string;
    sessionExpiration?: number;
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
