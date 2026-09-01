export interface Profile {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    sessionExpiration: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProfileDisplay {
    name: string;
    email: string;
    memberSince: string;
    recoveryMethods: number;
    credentialsCount: number;
}

export interface ChangeUserData {
    name?: string;
}

export interface ChangeEmailFormData {
    newEmail: string;
    password: string;
}

export interface ValidateChangeEmailData extends ChangeEmailFormData {
    currentEmail: string;
}
