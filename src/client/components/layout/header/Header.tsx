'use client';

import { useEffect } from 'react';

import { HeaderVariant } from '@/src/client/types/layout/header';
import { useCategories } from '@/src/client/hooks/categories/useCategories';

import { headerVariants } from './Header.config';
import HeaderMobile from './HeaderMobile';
import HeaderSearch from './HeaderSearch';
import HeaderSimple from './HeaderSimple';

interface HeaderProps {
    variant: HeaderVariant;
    credentialCount?: number;
    onSearch?: (query: string) => void;
    onFilterChange?: (value: string) => void;
    onNewCredential?: () => void;
    hideMobile?: boolean;
    filterOptions?: { value: string; label: string }[];
    selectedCategory?: string;
}

export default function Header({
    variant,
    credentialCount = 0,
    onSearch,
    onFilterChange,
    onNewCredential,
    hideMobile = false,
    filterOptions: customFilterOptions,
    selectedCategory = '',
}: HeaderProps) {
    const config = headerVariants[variant];

    const {
        categories,
        isLoading: isLoadingCategories,
        loadCategories,
    } = useCategories({ autoLoad: false });

    useEffect(() => {
        const shouldLoadCategories =
            config.type === 'search' &&
            config.showFilter &&
            !customFilterOptions &&
            variant !== 'audit';

        if (shouldLoadCategories) {
            loadCategories();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.type, config.showFilter, customFilterOptions, variant]);

    const subtitle =
        typeof config.defaultSubtitle === 'function'
            ? config.defaultSubtitle(credentialCount)
            : config.defaultSubtitle;

    const HeaderContent =
        config.type === 'search' ? HeaderSearch : HeaderSimple;

    const getFilterOptions = () => {
        if (customFilterOptions) {
            return customFilterOptions;
        }

        if (categories.length > 0) {
            return [
                { value: '', label: 'Todas as categorias' },
                ...categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                })),
            ];
        }

        return config.filterOptions || [{ value: '', label: 'Todos' }];
    };

    const filterOptionsFinal = getFilterOptions();

    return (
        <>
            {!hideMobile && <HeaderMobile />}

            <HeaderContent
                icon={config.icon}
                iconClass={config.iconClass}
                iconBgColor={config.bgColor}
                title={config.defaultTitle}
                subtitle={subtitle}
                {...(config.type === 'search'
                    ? {
                          onSearch,
                          onFilterChange,
                          onNewCredential,
                          showNewButton: config.showNewButton,
                          showFilter: config.showFilter,
                          searchPlaceholder: config.searchPlaceholder,
                          filterOptions: filterOptionsFinal,
                          categories: isLoadingCategories ? [] : categories,
                          selectedCategory,
                      }
                    : {})}
            />
        </>
    );
}
