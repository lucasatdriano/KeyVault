import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { decryptString } from '@/src/shared/crypto/cipher';
import { getCredentialsAction } from '@/src/server/actions/credentials/get-credentials.action';
import { copyPasswordAction } from '@/src/server/actions/credentials/copy-password.action';
import { toggleFavoriteAction } from '@/src/server/actions/credentials/toggle-favorite.action';
import { deleteCredentialAction } from '@/src/server/actions/credentials/delete-credential.action';
import { generateResourceSearchHash } from '@/src/shared/crypto/resource-search';
import { useVaultStore } from '@/src/client/store/vault.store';
import { usePagination } from '@/src/client/hooks/usePagination';
import { CredentialWithCategory } from '@/src/server/types/repository/credential';
import { Credential } from '@/src/shared/types/credential';

interface UseCredentialsOptions {
    initialPage?: number;
    initialItemsPerPage?: number;
    favorite?: boolean;
    deleted?: boolean;
}

interface DecryptCredentialParams {
    credential: CredentialWithCategory;
    vaultKey: Uint8Array;
}

async function decryptCredential({
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
    } as Credential;
}

export function useCredentials(options: UseCredentialsOptions = {}) {
    const {
        initialPage = 1,
        initialItemsPerPage = 18,
        favorite = false,
        deleted = false,
    } = options;

    const [credentials, setCredentials] = useState<Credential[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const vaultKey = useVaultStore((state) => state.vaultKey);

    const pagination = usePagination({
        initialPage,
        initialItemsPerPage,
    });

    const loadCredentials = useCallback(
        async (
            search?: string,
            category?: string,
            page: number = pagination.currentPage,
        ) => {
            if (!vaultKey) {
                return;
            }

            setIsLoading(true);

            try {
                const searchHash =
                    search && vaultKey
                        ? await generateResourceSearchHash(search, vaultKey)
                        : undefined;

                const result = await getCredentialsAction({
                    favorite: favorite || undefined,
                    deleted: deleted || undefined,
                    search: searchHash,
                    categoryId:
                        category && category !== '' ? category : undefined,
                    page,
                    limit: pagination.itemsPerPage,
                });

                if (!result.success || !result.data) {
                    return;
                }

                pagination.setTotalItems(result.data.total);

                const decrypted = await Promise.all(
                    result.data.data.map((credential) =>
                        decryptCredential({ credential, vaultKey }),
                    ),
                );

                setCredentials(decrypted);
            } catch (error) {
                console.error(error);
                toast.error('Erro ao carregar credenciais.');
            } finally {
                setIsLoading(false);
            }
        },
        [vaultKey, pagination, favorite, deleted],
    );

    const refresh = useCallback(async () => {
        await loadCredentials(
            searchQuery,
            selectedCategory,
            pagination.currentPage,
        );
    }, [
        loadCredentials,
        searchQuery,
        selectedCategory,
        pagination.currentPage,
    ]);

    const handleSearch = useCallback(
        async (query: string) => {
            setSearchQuery(query);
            pagination.resetPagination();
            await loadCredentials(query, selectedCategory, 1);
        },
        [loadCredentials, selectedCategory, pagination],
    );

    const handleFilterChange = useCallback(
        async (category: string) => {
            setSelectedCategory(category);
            pagination.resetPagination();
            await loadCredentials(searchQuery, category, 1);
        },
        [loadCredentials, searchQuery, pagination],
    );

    const handleCopy = useCallback(
        async (text: string, credentialId: string) => {
            try {
                await navigator.clipboard.writeText(text);

                const result = await copyPasswordAction(credentialId);

                if (!result.success) {
                    toast.error(result.error);
                    return;
                }

                toast.info(result.message);
            } catch {
                toast.error('Erro ao copiar credencial.');
            }
        },
        [],
    );

    const handleToggleFavorite = useCallback(
        async (id: string) => {
            try {
                const result = await toggleFavoriteAction(id);

                if (!result.success) {
                    toast.error(result.error);
                    return;
                }

                toast.success(result.message);

                await loadCredentials(
                    searchQuery,
                    selectedCategory,
                    pagination.currentPage,
                );
            } catch {
                toast.error('Erro ao atualizar favorito.');
            }
        },
        [
            loadCredentials,
            searchQuery,
            selectedCategory,
            pagination.currentPage,
        ],
    );

    const handleDelete = useCallback(
        async (credential: Credential) => {
            try {
                const result = await deleteCredentialAction(credential.id);

                if (!result.success) {
                    toast.error(result.error);
                    return;
                }

                toast.success(result.message);

                await loadCredentials(
                    searchQuery,
                    selectedCategory,
                    pagination.currentPage,
                );

                return true;
            } catch {
                toast.error('Erro ao excluir credencial.');
                return false;
            }
        },
        [
            loadCredentials,
            searchQuery,
            selectedCategory,
            pagination.currentPage,
        ],
    );

    const handlePageChange = useCallback(
        (page: number) => {
            pagination.goToPage(page);
            loadCredentials(searchQuery, selectedCategory, page);
        },
        [pagination, loadCredentials, searchQuery, selectedCategory],
    );

    return {
        credentials,
        isLoading,
        searchQuery,
        selectedCategory,

        pagination,

        loadCredentials,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        handleCopy,
        handleToggleFavorite,
        handleDelete,
        refresh,

        setSearchQuery,
        setSelectedCategory,
    };
}
