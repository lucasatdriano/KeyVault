/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getCategoriesAction } from '@/src/server/actions/category/get-categories.action';
import { DecryptedCategory } from '@/src/shared/types/category';
import { useVaultStore } from '@/src/client/store/vault.store';
import { decryptCategory } from '../../utils/categories/category-decryption';
import { useCategoriesStore } from '../../store/category.store';
import { sortCategoriesByOrder } from '../../utils/categories/category-sort';

interface UseCategoriesOptions {
    autoLoad?: boolean;
}

export function useCategories(options: UseCategoriesOptions = {}) {
    const { autoLoad = true } = options;

    const [categories, setCategories] = useState<DecryptedCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCacheUsed, setIsCacheUsed] = useState(false);

    const vaultKey = useVaultStore((state) => state.vaultKey);

    const {
        cachedCategories,
        syncCategories,
        isCacheStale,
        lastFetch,
        invalidateCache,
    } = useCategoriesStore();

    const isCacheValid = useCallback(() => {
        if (isCacheStale) return false;
        if (!lastFetch) return false;

        return Date.now() - lastFetch < 5 * 60 * 1000;
    }, [isCacheStale, lastFetch]);

    const loadCategories = useCallback(async () => {
        if (!vaultKey) {
            return;
        }

        if (isCacheValid()) {
            const sortedCache = sortCategoriesByOrder(cachedCategories);
            setCategories(sortedCache);
            setIsCacheUsed(true);
            return;
        }

        setIsLoading(true);
        setIsCacheUsed(false);

        try {
            const result = await getCategoriesAction();

            if (!result.success || !result.data) {
                toast.error('Erro ao carregar categorias.');
                return;
            }

            const decrypted = await Promise.all(
                result.data.map((category) =>
                    decryptCategory({
                        category,
                        vaultKey,
                    }),
                ),
            );

            const sorted = sortCategoriesByOrder(decrypted);

            setCategories(sorted);
            syncCategories(sorted);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            toast.error('Erro ao carregar categorias.');
        } finally {
            setIsLoading(false);
        }
    }, [vaultKey, isCacheValid, cachedCategories, syncCategories]);

    const refresh = useCallback(async () => {
        invalidateCache();
        await loadCategories();
    }, [invalidateCache, loadCategories]);

    const getCategoryById = useCallback(
        (id: string) => {
            return categories.find((category) => category.id === id);
        },
        [categories],
    );

    const getCategoryByName = useCallback(
        (name: string) => {
            return categories.find((category) => category.name === name);
        },
        [categories],
    );

    const getCategoryOptions = useCallback(() => {
        return [
            {
                value: '',
                label: 'Todas as categorias',
            },
            ...categories.map((category) => ({
                value: category.id,
                label: category.name,
            })),
        ];
    }, [categories]);

    const getCategorySelectOptions = useCallback(() => {
        return categories.map((category) => ({
            value: category.id,
            label: category.name,
        }));
    }, [categories]);

    useEffect(() => {
        if (!vaultKey || !autoLoad) {
            return;
        }

        loadCategories();
    }, [autoLoad, vaultKey, loadCategories]);

    return {
        categories,
        isLoading,
        isCacheUsed,
        loadCategories,
        refresh,
        getCategoryById,
        getCategoryByName,
        getCategoryOptions,
        getCategorySelectOptions,
    };
}
