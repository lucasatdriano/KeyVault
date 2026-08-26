import {
    CATEGORY_BADGE_COLORS,
    CATEGORY_COLORS,
} from '@/src/client/constants/categories';

export function getCategoryColor(category: string): string {
    return CATEGORY_COLORS[category] ?? 'from-primary to-secondary';
}

export function getCategoryBadgeColor(category: string): string {
    return (
        CATEGORY_BADGE_COLORS[category] ??
        'bg-primary/20 text-primary border-primary/30'
    );
}
