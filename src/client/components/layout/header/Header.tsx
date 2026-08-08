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
    filterOptions,
    selectedCategory = '',
}: HeaderProps) {
    const config = headerVariants[variant];

    const {
        categories,
        isLoading: isLoadingCategories,
        getCategoryOptions,
        loadCategories,
    } = useCategories({ autoLoad: false });

    useEffect(() => {
        if (config.type === 'search' && config.showFilter) {
            loadCategories();
        }
    }, [config.type, config.showFilter, loadCategories]);

    const subtitle =
        typeof config.defaultSubtitle === 'function'
            ? config.defaultSubtitle(credentialCount)
            : config.defaultSubtitle;

    const HeaderContent =
        config.type === 'search' ? HeaderSearch : HeaderSimple;

    const filterOptionsFinal = filterOptions ?? getCategoryOptions();

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
