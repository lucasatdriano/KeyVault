import { Credential } from '@/src/shared/types/credential';
import { CredentialWithCategory } from '@/src/server/types/repository/credential';
import { decryptString } from '@/src/shared/crypto/cipher';

interface DecryptCredentialParams {
    credential: CredentialWithCategory;
    vaultKey: Uint8Array;
}

export async function decryptCredential({
    credential,
    vaultKey,
}: DecryptCredentialParams): Promise<Credential> {
    const json = await decryptString(
        {
            cipherText: credential.cipherText,
            iv: credential.iv,
        },
        vaultKey,
    );

    const data = JSON.parse(json);

    let categoryName = 'Outros';

    if (credential.category) {
        categoryName = await decryptString(
            {
                cipherText: credential.category.cipherText,
                iv: credential.category.iv,
            },
            vaultKey,
        );
    }

    return {
        id: credential.id,
        userId: credential.userId,
        categoryId: credential.categoryId,

        title: data.title,
        username: data.username,
        email: data.email,
        password: data.password,
        url: data.url,
        notes: data.notes,

        category: categoryName,

        favorite: credential.favorite,

        createdAt: credential.createdAt.toISOString(),
        updatedAt: credential.updatedAt.toISOString(),
        deletedAt: credential.deletedAt?.toISOString() || '',
    };
}
