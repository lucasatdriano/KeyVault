import { DecryptedCategory } from '@/src/shared/types/category';

import { CATEGORY_ORDER_MAP } from '@/src/client/constants/categories';

export const sortCategoriesByOrder = (
    categoriesToSort: DecryptedCategory[],
): DecryptedCategory[] => {
    return [...categoriesToSort].sort((a, b) => {
        const orderA = CATEGORY_ORDER_MAP[a.name] ?? Number.MAX_SAFE_INTEGER;
        const orderB = CATEGORY_ORDER_MAP[b.name] ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
    });
};
