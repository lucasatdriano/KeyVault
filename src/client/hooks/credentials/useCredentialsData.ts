/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getCredentialsAction } from '@/src/server/actions/credentials/get-credentials.action';

import { generateResourceSearchHash } from '@/src/shared/crypto/resource-search';
import { Credential } from '@/src/shared/types/credential';

import { useCredentialsStore } from '@/src/client/store/credential.store';
import { useVaultStore } from '@/src/client/store/vault.store';
import { usePagination } from '@/src/client/hooks/ui/usePagination';
import { decryptCredential } from '@/src/client/utils/credentials/credential-decryption';

interface UseCredentialsDataOptions {
    initialPage?: number;
    initialItemsPerPage?: number;
    favorite?: boolean;
    deleted?: boolean;
}

export function useCredentialsData(options: UseCredentialsDataOptions = {}) {
    const {
        initialPage = 1,
        initialItemsPerPage = 18,
        favorite = false,
        deleted = false,
    } = options;

    const vaultKey = useVaultStore((state) => state.vaultKey);

    const [localCredentials, setLocalCredentials] = useState<Credential[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isCacheUsed, setIsCacheUsed] = useState(false);

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
        if (isCacheStale) return false;
        if (!lastFetch) return false;
        return Date.now() - lastFetch < 5 * 60 * 1000;
    }, [isCacheStale, lastFetch]);

    const loadCredentials = useCallback(
        async (
            search: string = '',
            category: string = '',
            page: number = 1,
        ) => {
            if (!vaultKey) return;

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
                const searchHash = search
                    ? await generateResourceSearchHash(search, vaultKey)
                    : undefined;

                const result = await getCredentialsAction({
                    favorite: favorite || undefined,
                    deleted: deleted || undefined,
                    search: searchHash,
                    categoryId: category || undefined,
                    page,
                    limit: itemsPerPage,
                });

                if (!result.success || !result.data) return;

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
        if (!vaultKey) return;

        loadCredentials(searchQuery, selectedCategory, currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vaultKey, searchQuery, selectedCategory, currentPage]);

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
        (query: string) => {
            setSearchQuery(query);
            resetPagination();
            invalidateCache();
        },
        [resetPagination, invalidateCache],
    );

    const handleFilterChange = useCallback(
        (category: string) => {
            setSelectedCategory(category);
            resetPagination();
            invalidateCache();
        },
        [resetPagination, invalidateCache],
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
        isCacheUsed,
        searchQuery,
        selectedCategory,

        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        goToPage,
        setTotalItems,
        decrementTotalItems,
        incrementTotalItems,
        resetPagination,

        loadCredentials,
        refresh,
        handleSearch,
        handleFilterChange,
        handlePageChange,
        invalidateCache,

        setSearchQuery,
        setSelectedCategory,
        setLocalCredentials,
    };
}
