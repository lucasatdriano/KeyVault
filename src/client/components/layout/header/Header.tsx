'use client';

import { useEffect, useState } from 'react';
import { HeaderVariant } from '@/src/client/types/layout/header';
import { headerVariants } from './Header.config';
import HeaderMobile from './HeaderMobile';
import HeaderSearch from './HeaderSearch';
import HeaderSimple from './HeaderSimple';
import { getCategoriesAction } from '@/src/server/actions/category/get-categories.action';
import { decryptString } from '@/src/shared/crypto/cipher';
import { useVaultStore } from '@/src/client/store/vault.store';
import { DEFAULT_CATEGORIES } from '@/src/client/constants/categories';

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
    const [categories, setCategories] = useState<
        { id: string; name: string }[]
    >([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);

    const vaultKey = useVaultStore((state) => state.vaultKey);

    const config = headerVariants[variant];

    const subtitle =
        typeof config.defaultSubtitle === 'function'
            ? config.defaultSubtitle(credentialCount)
            : config.defaultSubtitle;

    const HeaderContent =
        config.type === 'search' ? HeaderSearch : HeaderSimple;

    useEffect(() => {
        const loadCategories = async () => {
            if (config.type === 'search' && config.showFilter && vaultKey) {
                setIsLoadingCategories(true);

                try {
                    const result = await getCategoriesAction();

                    if (result.success && result.data) {
                        const decryptedCategories = await Promise.all(
                            result.data.map(async (cat) => {
                                try {
                                    const name = await decryptString(
                                        {
                                            cipherText: cat.cipherText,
                                            iv: cat.iv,
                                        },
                                        vaultKey,
                                    );

                                    return {
                                        id: cat.id,
                                        name: name,
                                    };
                                } catch (error) {
                                    console.error(
                                        `Erro ao descriptografar categoria ${cat.id}:`,
                                        error,
                                    );
                                    return {
                                        id: cat.id,
                                        name: 'Categoria',
                                    };
                                }
                            }),
                        );

                        const uniqueCategories = decryptedCategories.reduce(
                            (acc, current) => {
                                const exists = acc.find(
                                    (item) => item.name === current.name,
                                );
                                if (!exists) {
                                    acc.push(current);
                                }
                                return acc;
                            },
                            [] as { id: string; name: string }[],
                        );

                        setCategories(uniqueCategories);
                    } else {
                        const defaultCats = DEFAULT_CATEGORIES.map(
                            (cat, index) => ({
                                id: `default-${index}`,
                                name: cat.name,
                            }),
                        );
                        setCategories(defaultCats);
                    }
                } catch (error) {
                    console.error('Erro ao carregar categorias:', error);
                    const defaultCats = DEFAULT_CATEGORIES.map(
                        (cat, index) => ({
                            id: `default-${index}`,
                            name: cat.name,
                        }),
                    );
                    setCategories(defaultCats);
                } finally {
                    setIsLoadingCategories(false);
                }
            }
        };

        loadCategories();
    }, [config.type, config.showFilter, vaultKey]);

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
                          filterOptions: filterOptions ?? config.filterOptions,
                          categories: isLoadingCategories ? [] : categories,
                          selectedCategory,
                      }
                    : {})}
            />
        </>
    );
}
