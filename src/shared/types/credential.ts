export interface Credential {
    id: string;
    userId: string;
    categoryId?: string | null;

    category: string;
    title: string;
    username?: string;
    email?: string;
    password: string;
    url?: string;
    notes?: string;

    favorite: boolean;

    deletedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface CredentialFormData {
    title: string;
    categoryId?: string | null;
    username?: string;
    email?: string;
    password: string;
    url?: string;
    notes?: string;
}
