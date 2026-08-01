'use client';

import { HeaderVariant } from '@/src/client/types/header';
import { headerVariants } from './Header.config';
import HeaderMobile from './HeaderMobile';
import HeaderSearch from './HeaderSearch';
import HeaderSimple from './HeaderSimple';

interface HeaderProps {
    variant: HeaderVariant;
    credentialCount?: number;
    onSearch?: (query: string) => void;
    onNewCredential?: () => void;
    hideMobile?: boolean;
    filterOptions?: { value: string; label: string }[];
}

export default function Header({
    variant,
    credentialCount = 0,
    onSearch,
    onNewCredential,
    hideMobile = false,
    filterOptions,
}: HeaderProps) {
    const config = headerVariants[variant];

    const subtitle =
        typeof config.defaultSubtitle === 'function'
            ? config.defaultSubtitle(credentialCount)
            : config.defaultSubtitle;

    const HeaderContent =
        config.type === 'search' ? HeaderSearch : HeaderSimple;

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
                          onNewCredential,
                          showNewButton: config.showNewButton,
                          showFilter: config.showFilter,
                          searchPlaceholder: config.searchPlaceholder,
                          filterOptions: filterOptions ?? config.filterOptions,
                      }
                    : {})}
            />
        </>
    );
}
