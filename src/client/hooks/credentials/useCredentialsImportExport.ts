import { useCallback } from 'react';
import { toast } from 'sonner';

import { exportCredentialsAction } from '@/src/server/actions/credentials/export-credentials.action';
import { importCredentialsAction } from '@/src/server/actions/credentials/import-credentials.action';

import { ExportCredential } from '@/src/shared/types/credential';

import { useVaultStore } from '@/src/client/store/vault.store';
import { useCategories } from '@/src/client/hooks/categories/useCategories';
import { downloadCredentialsExport } from '@/src/client/utils/credentials/credential-export';
import { importCredentialsFromFile } from '@/src/client/utils/credentials/credential-import';
import { decryptCredential } from '@/src/client/utils/credentials/credential-decryption';

interface UseCredentialsImportExportOptions {
    refresh: () => void;
    invalidateCache: () => void;
}

export function useCredentialsImportExport(
    options: UseCredentialsImportExportOptions,
) {
    const vaultKey = useVaultStore((state) => state.vaultKey);
    const { categories, isLoading: isLoadingCategories } = useCategories();

    const handleExport = useCallback(async () => {
        if (!vaultKey) {
            toast.error('Vault Key não encontrada.');
            return;
        }

        try {
            const result = await exportCredentialsAction();

            if (!result.success || !result.data) {
                toast.error(result.error ?? 'Erro ao exportar credenciais.');
                return;
            }

            const decrypted = await Promise.all(
                result.data.map((credential) =>
                    decryptCredential({
                        credential,
                        vaultKey,
                    }),
                ),
            );

            const exportCredentials: ExportCredential[] = decrypted.map(
                (credential): ExportCredential => ({
                    title: credential.title,
                    username: credential.username,
                    email: credential.email,
                    password: credential.password,
                    url: credential.url,
                    notes: credential.notes,
                    category: credential.category,
                    favorite: credential.favorite,
                }),
            );

            downloadCredentialsExport(exportCredentials);
            toast.success('Credenciais exportadas com sucesso.');
        } catch (error) {
            console.error('Erro ao exportar credenciais:', error);
            toast.error('Erro ao exportar credenciais.');
        }
    }, [vaultKey]);

    const handleImport = useCallback(
        async (file: File) => {
            if (!vaultKey) {
                toast.error('Vault Key não encontrada.');
                return false;
            }

            if (isLoadingCategories) {
                toast.info('Aguarde o carregamento das categorias.');
                return false;
            }

            try {
                const result = await importCredentialsFromFile(
                    file,
                    vaultKey,
                    categories,
                );

                if (!result.success || !result.credentials) {
                    toast.error(result.error);
                    return false;
                }

                const importResult = await importCredentialsAction(
                    result.credentials,
                );

                if (!importResult.success || !importResult.data) {
                    toast.error(
                        importResult.error ?? 'Erro ao importar credenciais.',
                    );
                    return false;
                }

                options.invalidateCache();
                await options.refresh();

                toast.success(
                    `${importResult.data.count} credencial(is) importada(s) com sucesso.`,
                );
                return true;
            } catch (error) {
                console.error('Erro ao importar credenciais:', error);
                toast.error('Erro ao importar credenciais.');
                return false;
            }
        },
        [vaultKey, categories, isLoadingCategories, options],
    );

    return {
        handleExport,
        handleImport,
    };
}
