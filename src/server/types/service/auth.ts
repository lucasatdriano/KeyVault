export interface VerifyEmailData {
    userId: string;
    token: string;
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
}

export interface ChangePasswordResult {
    success: boolean;
    message: string;
}
