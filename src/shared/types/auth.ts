export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

export interface ChangePasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangeEmailData {
    newEmail: string;
    password: string;
}
