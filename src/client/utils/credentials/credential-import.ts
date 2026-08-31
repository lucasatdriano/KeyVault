import { CreateCredentialData } from '@/src/server/types/repository/credential';

import { generateResourceSearchHash } from '@/src/shared/crypto/resource-search';
import { bytesToBase64 } from '@/src/shared/crypto/encoding';
import { encryptString } from '@/src/shared/crypto/cipher';
import { generateSalt } from '@/src/shared/crypto/random';
import { CredentialExport } from '@/src/shared/types/credential';

export async function importCredentialsFromFile(
    file: File,
    vaultKey: Uint8Array,
    categories: Array<{ id: string; name: string }>,
): Promise<{
    success: boolean;
    credentials?: CreateCredentialData[];
    error?: string;
}> {
    try {
        const content = await file.text();
        const parsed: CredentialExport = JSON.parse(content);

        if (parsed.version !== 1 || !Array.isArray(parsed.credentials)) {
            return { success: false, error: 'Arquivo de importação inválido.' };
        }

        if (parsed.credentials.length === 0) {
            return {
                success: false,
                error: 'O arquivo não possui credenciais.',
            };
        }

        const credentials: CreateCredentialData[] = [];

        for (const credential of parsed.credentials) {
            if (!credential.title || !credential.password) {
                continue;
            }

            const payload = {
                title: credential.title,
                username: credential.username || '',
                email: credential.email || '',
                password: credential.password,
                url: credential.url || '',
                notes: credential.notes || '',
            };

            const encrypted = await encryptString(
                JSON.stringify(payload),
                vaultKey,
            );

            const resourceSearchHash = await generateResourceSearchHash(
                credential.title,
                vaultKey,
            );

            const salt = bytesToBase64(generateSalt());

            const category = credential.category
                ? categories.find(
                      (current) => current.name === credential.category,
                  )
                : undefined;

            credentials.push({
                userId: '',
                categoryId: category?.id ?? null,
                cipherText: encrypted.cipherText,
                iv: encrypted.iv,
                salt,
                version: 1,
                algorithm: 'AES-256-GCM',
                resourceSearchHash,
                favorite: credential.favorite ?? false,
            });
        }

        if (credentials.length === 0) {
            return {
                success: false,
                error: 'Nenhuma credencial válida encontrada no arquivo.',
            };
        }

        return { success: true, credentials };
    } catch (error) {
        console.error('Erro ao preparar credenciais para importação:', error);
        return { success: false, error: 'Arquivo de importação inválido.' };
    }
}
