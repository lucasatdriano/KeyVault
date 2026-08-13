import { DecryptedCategory } from '@/src/shared/types/category';
import { create } from 'zustand';

interface CategoriesStore {
    cachedCategories: DecryptedCategory[];
    lastFetch: number | null;
    isCacheStale: boolean;

    syncCategories: (categories: DecryptedCategory[]) => void;
    invalidateCache: () => void;
    clearStore: () => void;
}

export const useCategoriesStore = create<CategoriesStore>((set) => ({
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

    clearStore: () => {
        set({
            cachedCategories: [],
            lastFetch: null,
            isCacheStale: true,
        });
    },
}));
