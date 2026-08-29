import { Category } from '@/src/generated/prisma/client';

import { DecryptedCategory } from '@/src/shared/types/category';
import { decryptString } from '@/src/shared/crypto/cipher';

interface DecryptCategoryParams {
    category: Category;
    vaultKey: Uint8Array;
}

export async function decryptCategory({
    category,
    vaultKey,
}: DecryptCategoryParams): Promise<DecryptedCategory> {
    const name = await decryptString(
        {
            cipherText: category.cipherText,
            iv: category.iv,
        },
        vaultKey,
    );

    return {
        id: category.id,
        name,
    };
}
