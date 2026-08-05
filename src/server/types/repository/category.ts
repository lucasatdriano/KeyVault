export interface CreateCategoryData {
    userId: string;
    cipherText: string;
    iv: string;
}

export interface UpdateCategoryData {
    id: string;
    cipherText?: string;
}
