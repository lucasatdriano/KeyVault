export interface CreateCategoryData {
    userId: string;
    cipherText: string;
    iv: string;
    color?: string | null;
}

export interface UpdateCategoryData {
    id: string;
    cipherText?: string;
    color?: string | null;
}
