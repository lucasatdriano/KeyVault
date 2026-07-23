export interface Credential {
    id: string;
    userId: string;
    categoryId?: string | null;
    title: string;
    username: string;
    password: string;
    url?: string;
    notes?: string;
    favorite: boolean;
    createdAt: string;
    updatedAt: string;
}
