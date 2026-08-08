import { DecryptedCategory } from '@/src/shared/types/category';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CategoriesStore {
    cachedCategories: DecryptedCategory[];
    lastFetch: number | null;
    isCacheStale: boolean;

    syncCategories: (categories: DecryptedCategory[]) => void;
    invalidateCache: () => void;
    clearCache: () => void;
}

export const useCategoriesStore = create<CategoriesStore>()(
    persist(
        (set) => ({
            cachedCategories: [],
            lastFetch: null,
            isCacheStale: true,

            syncCategories: (categories) => {
                set({
                    cachedCategories: categories,
                    lastFetch: Date.now(),
                    isCacheStale: false,
                });
            },

            invalidateCache: () => {
                set({ isCacheStale: true });
            },

            clearCache: () => {
                set({
                    cachedCategories: [],
                    lastFetch: null,
                    isCacheStale: true,
                });
            },
        }),
        {
            name: 'categories-storage',
            partialize: (state) => ({
                cachedCategories: state.cachedCategories,
                lastFetch: state.lastFetch,
                isCacheStale: state.isCacheStale,
            }),
        },
    ),
);
