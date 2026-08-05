import { Category, Credential } from '@/src/generated/prisma/client';
import { PaginationQuery } from '@/src/shared/types/pagination';

export interface CreateCredentialData {
    userId: string;
    categoryId?: string | null;
    cipherText: string;
    resourceSearchHash?: string | null;

    iv: string;
    salt: string;
    algorithm?: string;
    version?: number;
    favorite?: boolean;
}

export interface UpdateCredentialData {
    id: string;
    categoryId?: string | null;
    cipherText?: string;
    resourceSearchHash?: string | null;

    iv?: string;
    salt?: string;
    algorithm?: string;
    version?: number;
    favorite?: boolean;
}

export type CredentialWithCategory = Credential & {
    category: Category | null;
};

export interface FindCredentialsOptions extends PaginationQuery {
    categoryId?: string;
    favorite?: boolean;
    resourceSearchHash?: string | null;
    search?: string;
    deleted?: boolean;
}
