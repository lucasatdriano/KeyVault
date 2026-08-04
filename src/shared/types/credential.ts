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

    createdAt: string;
    updatedAt: string;
}

export interface CreateCredentialData {
    title: string;
    category: string;
    username?: string;
    email?: string;
    password: string;
    url?: string;
    notes?: string;
}
