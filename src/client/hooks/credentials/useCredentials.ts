/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getCredentialsAction } from '@/src/server/actions/credentials/get-credentials.action';
import { copyPasswordAction } from '@/src/server/actions/credentials/copy-password.action';
import { toggleFavoriteAction } from '@/src/server/actions/credentials/toggle-favorite.action';
import { deleteCredentialAction } from '@/src/server/actions/credentials/delete-credential.action';
import { restoreCredentialAction } from '@/src/server/actions/credentials/restore-credential.action';
import { createCredentialAction } from '@/src/server/actions/credentials/create-credential.action';
import { updateCredentialAction } from '@/src/server/actions/credentials/update-credential.action';

import { encryptString } from '@/src/shared/crypto/cipher';
import { generateResourceSearchHash } from '@/src/shared/crypto/resource-search';
import { bytesToBase64 } from '@/src/shared/crypto/encoding';
import { generateSalt } from '@/src/shared/crypto/random';
import { Credential, CredentialFormData } from '@/src/shared/types/credential';

import { useVaultStore } from '@/src/client/store/vault.store';
import { useCredentialsStore } from '@/src/client/store/credential.store';
import { usePagination } from '@/src/client/hooks/ui/usePagination';
import { decryptCredential } from '@/src/client/utils/credentials/credential-decryption';

interface UseCredentialsOptions {
    initialPage?: number;
    initialItemsPerPage?: number;
    favorite?: boolean;
    deleted?: boolean;
}

interface CreateCredentialResult {
    success: boolean;
    error?: string;
    data?: Credential;
}

interface UpdateCredentialResult {
    success: boolean;
    error?: string;
    data?: Credential;
}

export function useCredentials(options: UseCredentialsOptions = {}) {
    const {
        initialPage = 1,
        initialItemsPerPage = 18,
        favorite = false,
        deleted = false,
    } = options;

    const [localCredentials, setLocalCredentials] = useState<Credential[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isCacheUsed, setIsCacheUsed] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const vaultKey = useVaultStore((state) => state.vaultKey);

    const {
        credentials: cachedCredentials,
        deletedCredentials: cachedDeleted,
        favoriteCredentials: cachedFavorites,

        credentialsCacheInitialized,
        favoriteCacheInitialized,
        deletedCacheInitialized,

        syncCredentials,
        syncDeletedCredentials,
        syncFavoriteCredentials,

        isCacheStale,
        lastFetch,
        invalidateCache,

        toggleFavorite: toggleFavoriteStore,
        deleteCredential: deleteCredentialStore,
        restoreCredential: restoreCredentialStore,
        addCredential: addCredentialStore,
        updateCredential: updateCredentialStore,
    } = useCredentialsStore();

    const {
        currentPage,
        itemsPerPage,
        totalPages,
        totalItems,
        goToPage,
        resetPagination,
        setTotalItems,
        decrementTotalItems,
        incrementTotalItems,
    } = usePagination({
        initialPage,
        initialItemsPerPage,
    });

    const isCacheValid = useCallback(() => {
        if (isCacheStale) {
            return false;
        }

        if (!lastFetch) {
            return false;
        }

        return Date.now() - lastFetch < 5 * 60 * 1000;
    }, [isCacheStale, lastFetch]);

    const loadCredentials = useCallback(
        async (
            search?: string,
            category?: string,
            page: number = currentPage,
        ) => {
            if (!vaultKey) {
                return;
            }

            const cacheInitialized = deleted
                ? deletedCacheInitialized
                : favorite
                  ? favoriteCacheInitialized
                  : credentialsCacheInitialized;

            const canUseCache =
                page === 1 &&
                !search &&
                !category &&
                isCacheValid() &&
                cacheInitialized;

            if (canUseCache) {
                let data: Credential[];

                if (deleted) {
                    data = cachedDeleted;
                } else if (favorite) {
                    data = cachedFavorites;
                } else {
                    data = cachedCredentials;
                }

                setLocalCredentials(data);
                setTotalItems(data.length);
                setIsLoading(false);
                setIsCacheUsed(true);

                return;
            }

            setIsLoading(true);
            setIsCacheUsed(false);

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
                    limit: itemsPerPage,
                });

                if (!result.success || !result.data) {
                    return;
                }

                setTotalItems(result.data.total);

                const decrypted = await Promise.all(
                    result.data.data.map((credential) =>
                        decryptCredential({
                            credential,
                            vaultKey,
                        }),
                    ),
                );

                setLocalCredentials(decrypted);

                if (page === 1 && !search && !category) {
                    if (deleted) {
                        syncDeletedCredentials(decrypted);
                    } else if (favorite) {
                        syncFavoriteCredentials(decrypted);
                    } else {
                        syncCredentials(decrypted);
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error('Erro ao carregar credenciais.');
            } finally {
                setIsLoading(false);
            }
        },
        [
            vaultKey,
            currentPage,
            itemsPerPage,
            favorite,
            deleted,

            isCacheValid,

            cachedCredentials,
            cachedDeleted,
            cachedFavorites,

            credentialsCacheInitialized,
            favoriteCacheInitialized,
            deletedCacheInitialized,

            setTotalItems,

            syncCredentials,
            syncDeletedCredentials,
            syncFavoriteCredentials,
        ],
    );

    useEffect(() => {
        if (!vaultKey) {
            return;
        }

        loadCredentials();
    }, [vaultKey, loadCredentials]);

    const refresh = useCallback(async () => {
        invalidateCache();

        await loadCredentials(searchQuery, selectedCategory, currentPage);
    }, [
        loadCredentials,
        searchQuery,
        selectedCategory,
        currentPage,
        invalidateCache,
    ]);

    const handleSearch = useCallback(
        async (query: string) => {
            setSearchQuery(query);
            resetPagination();
            invalidateCache();

            await loadCredentials(query, selectedCategory, 1);
        },
        [loadCredentials, selectedCategory, resetPagination, invalidateCache],
    );

    const handleFilterChange = useCallback(
        async (category: string) => {
            setSelectedCategory(category);
            resetPagination();
            invalidateCache();

            await loadCredentials(searchQuery, category, 1);
        },
        [loadCredentials, searchQuery, resetPagination, invalidateCache],
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
                toggleFavoriteStore(id);

                setLocalCredentials((prev) =>
                    prev.map((credential) =>
                        credential.id === id
                            ? {
                                  ...credential,
                                  favorite: !credential.favorite,
                              }
                            : credential,
                    ),
                );

                const result = await toggleFavoriteAction(id);

                if (!result.success) {
                    toggleFavoriteStore(id);

                    setLocalCredentials((prev) =>
                        prev.map((credential) =>
                            credential.id === id
                                ? {
                                      ...credential,
                                      favorite: !credential.favorite,
                                  }
                                : credential,
                        ),
                    );

                    toast.error(result.error);
                    return;
                }

                toast.success(result.message);
            } catch {
                toggleFavoriteStore(id);

                setLocalCredentials((prev) =>
                    prev.map((credential) =>
                        credential.id === id
                            ? {
                                  ...credential,
                                  favorite: !credential.favorite,
                              }
                            : credential,
                    ),
                );

                toast.error('Erro ao atualizar favorito.');
            }
        },
        [toggleFavoriteStore],
    );

    const handleCreateCredential = useCallback(
        async (
            formData: CredentialFormData,
        ): Promise<CreateCredentialResult> => {
            if (!vaultKey) {
                return {
                    success: false,
                    error: 'Vault Key não encontrada.',
                };
            }

            setIsCreating(true);

            try {
                const payload = {
                    title: formData.title,
                    username: formData.username || '',
                    email: formData.email || '',
                    password: formData.password,
                    url: formData.url || '',
                    notes: formData.notes || '',
                };

                const encrypted = await encryptString(
                    JSON.stringify(payload),
                    vaultKey,
                );

                const resourceSearchHash = await generateResourceSearchHash(
                    formData.title,
                    vaultKey,
                );

                const salt = bytesToBase64(generateSalt());

                const result = await createCredentialAction({
                    categoryId: formData.categoryId || null,
                    cipherText: encrypted.cipherText,
                    iv: encrypted.iv,
                    salt,
                    resourceSearchHash,
                    version: 1,
                    algorithm: 'AES-256-GCM',
                    favorite: false,
                });

                if (!result.success) {
                    return {
                        success: false,
                        error: result.error,
                    };
                }

                const now = new Date().toISOString();

                const tempCredential: Credential = {
                    id: crypto.randomUUID(),
                    userId: '',
                    categoryId: formData.categoryId || null,
                    category: 'Carregando...',
                    title: formData.title,
                    username: formData.username || '',
                    email: formData.email || '',
                    password: formData.password,
                    url: formData.url || '',
                    notes: formData.notes || '',
                    favorite: false,
                    createdAt: now,
                    updatedAt: now,
                    deletedAt: '',
                };

                addCredentialStore(tempCredential);

                setLocalCredentials((prev) => [tempCredential, ...prev]);

                incrementTotalItems();

                setTimeout(async () => {
                    await refresh();
                }, 500);

                return {
                    success: true,
                    data: tempCredential,
                };
            } catch (error) {
                console.error('Erro ao criar credencial:', error);

                return {
                    success: false,
                    error: 'Erro ao criar credencial.',
                };
            } finally {
                setIsCreating(false);
            }
        },
        [vaultKey, addCredentialStore, refresh, incrementTotalItems],
    );

    const handleUpdateCredential = useCallback(
        async (
            credential: Credential,
            formData: CredentialFormData,
        ): Promise<UpdateCredentialResult> => {
            if (!vaultKey) {
                return {
                    success: false,
                    error: 'Vault Key não encontrada.',
                };
            }

            setIsUpdating(true);

            try {
                const payload = {
                    title: formData.title,
                    username: formData.username || '',
                    email: formData.email || '',
                    password: formData.password,
                    url: formData.url || '',
                    notes: formData.notes || '',
                };

                const encrypted = await encryptString(
                    JSON.stringify(payload),
                    vaultKey,
                );

                let resourceSearchHash: string | null = null;

                if (formData.title !== credential.title) {
                    resourceSearchHash = await generateResourceSearchHash(
                        formData.title,
                        vaultKey,
                    );
                }

                const salt = bytesToBase64(generateSalt());

                const result = await updateCredentialAction({
                    id: credential.id,
                    categoryId: formData.categoryId || null,
                    cipherText: encrypted.cipherText,
                    iv: encrypted.iv,
                    salt,
                    resourceSearchHash,
                    version: 1,
                    algorithm: 'AES-256-GCM',
                    favorite: credential.favorite,
                });

                if (!result.success) {
                    return {
                        success: false,
                        error: result.error,
                    };
                }

                const now = new Date().toISOString();

                const updatedCredential: Credential = {
                    ...credential,
                    title: formData.title,
                    categoryId: formData.categoryId || null,
                    username: formData.username || '',
                    email: formData.email || '',
                    password: formData.password,
                    url: formData.url || '',
                    notes: formData.notes || '',
                    updatedAt: now,
                };

                updateCredentialStore(credential.id, updatedCredential);

                setLocalCredentials((prev) =>
                    prev.map((current) =>
                        current.id === credential.id
                            ? updatedCredential
                            : current,
                    ),
                );

                setTimeout(async () => {
                    await refresh();
                }, 500);

                return {
                    success: true,
                    data: updatedCredential,
                };
            } catch (error) {
                console.error('Erro ao atualizar credencial:', error);

                return {
                    success: false,
                    error: 'Erro ao atualizar credencial.',
                };
            } finally {
                setIsUpdating(false);
            }
        },
        [vaultKey, updateCredentialStore, refresh],
    );

    const handleDelete = useCallback(
        async (credential: Credential) => {
            try {
                deleteCredentialStore(credential.id);

                setLocalCredentials((prev) =>
                    prev.filter((current) => current.id !== credential.id),
                );

                decrementTotalItems();

                const result = await deleteCredentialAction(credential.id);

                if (!result.success) {
                    await refresh();
                    toast.error(result.error);
                    return false;
                }

                toast.success(result.message);
                return true;
            } catch {
                await refresh();
                toast.error('Erro ao excluir credencial.');
                return false;
            }
        },
        [deleteCredentialStore, refresh, decrementTotalItems],
    );

    const handleRestore = useCallback(
        async (id: string) => {
            try {
                restoreCredentialStore(id);

                if (deleted) {
                    setLocalCredentials((prev) =>
                        prev.filter((credential) => credential.id !== id),
                    );

                    decrementTotalItems();
                }

                const result = await restoreCredentialAction(id);

                if (!result.success) {
                    deleteCredentialStore(id);
                    await refresh();
                    toast.error(result.error);
                    return false;
                }

                toast.success(result.message);

                setTimeout(async () => {
                    invalidateCache();

                    await loadCredentials(
                        searchQuery,
                        selectedCategory,
                        currentPage,
                    );
                }, 300);

                return true;
            } catch {
                deleteCredentialStore(id);
                await refresh();
                toast.error('Erro ao restaurar credencial.');

                return false;
            }
        },
        [
            restoreCredentialStore,
            deleteCredentialStore,
            refresh,
            deleted,
            invalidateCache,
            loadCredentials,
            searchQuery,
            selectedCategory,
            currentPage,
            decrementTotalItems,
        ],
    );

    const handlePageChange = useCallback(
        (page: number) => {
            goToPage(page);

            loadCredentials(searchQuery, selectedCategory, page);
        },
        [goToPage, loadCredentials, searchQuery, selectedCategory],
    );

    return {
        credentials: localCredentials,

        isLoading,
        isCreating,
        isUpdating,

        searchQuery,
        selectedCategory,
        isCacheUsed,

        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        goToPage,

        loadCredentials,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        handleCopy,
        handleToggleFavorite,
        handleDelete,
        handleRestore,
        handleCreateCredential,
        handleUpdateCredential,
        refresh,

        setSearchQuery,
        setSelectedCategory,
    };
}
