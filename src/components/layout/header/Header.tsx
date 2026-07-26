'use client';

import React from 'react';
import {
    ActivityIcon,
    FingerprintIcon,
    KeyIcon,
    StarIcon,
    Trash2Icon,
    UserIcon,
    ShieldIcon,
    SettingsIcon,
} from 'lucide-react';
import HeaderMobile from './HeaderMobile';
import HeaderSearch from './HeaderSearch';
import HeaderSimple from './HeaderSimple';

type HeaderVariant =
    | 'search'
    | 'favorites'
    | 'trash'
    | 'account'
    | 'security'
    | 'recovery'
    | 'audit'
    | 'settings';

interface HeaderProps {
    variant: HeaderVariant;
    title?: string;
    subtitle?: string;
    credentialCount?: number;
    onMenuClick?: () => void;
    onSearch?: (query: string) => void;
    onNewCredential?: () => void;
    showNewButton?: boolean;
    hideMobile?: boolean;
    filterOptions?: { value: string; label: string }[];
}

interface HeaderConfig {
    icon: React.ReactNode;
    bgColor: string;
    defaultTitle: string;
    defaultSubtitle: string | ((count: number) => string);
    type: 'search' | 'simple';
    showNewButton?: boolean;
    showFilter?: boolean;
    searchPlaceholder?: string;
    filterOptions?: { value: string; label: string }[];
}

const headerConfig: Record<HeaderVariant, HeaderConfig> = {
    search: {
        icon: <KeyIcon className="w-6 h-6 text-primary" />,
        bgColor: 'bg-primary/10',
        defaultTitle: 'Minhas Credenciais',
        defaultSubtitle: (count: number) => `${count} Credenciais`,
        type: 'search' as const,
        showNewButton: true,
        showFilter: true,
        searchPlaceholder: 'Pesquisar credenciais...',
    },
    favorites: {
        icon: <StarIcon className="w-6 h-6 text-warning" />,
        bgColor: 'bg-warning/10',
        defaultTitle: 'Favoritos',
        defaultSubtitle: (count: number) => `${count} Credenciais favoritas`,
        type: 'search' as const,
        showNewButton: false,
        showFilter: true,
        searchPlaceholder: 'Pesquisar favoritos...',
    },
    trash: {
        icon: <Trash2Icon className="w-6 h-6 text-error" />,
        bgColor: 'bg-error/10',
        defaultTitle: 'Lixeira',
        defaultSubtitle: (count: number) => `${count} Credenciais na lixeira`,
        type: 'search' as const,
        showNewButton: false,
        showFilter: true,
        searchPlaceholder: 'Pesquisar na lixeira...',
    },
    account: {
        icon: <UserIcon className="w-6 h-6 text-primary" />,
        bgColor: 'bg-primary/10',
        defaultTitle: 'Conta',
        defaultSubtitle: 'Gerencie suas informações',
        type: 'simple' as const,
    },
    security: {
        icon: <ShieldIcon className="w-6 h-6 text-success" />,
        bgColor: 'bg-success/10',
        defaultTitle: 'Segurança',
        defaultSubtitle: 'Proteja sua conta',
        type: 'simple' as const,
    },
    recovery: {
        icon: <FingerprintIcon className="w-6 h-6 text-danger" />,
        bgColor: 'bg-danger/10',
        defaultTitle: 'Recuperação',
        defaultSubtitle: 'Opções de recuperação',
        type: 'simple' as const,
    },
    audit: {
        icon: <ActivityIcon className="w-6 h-6 text-purple" />,
        bgColor: 'bg-purple/10',
        defaultTitle: 'Auditoria',
        defaultSubtitle: 'Histórico de atividades',
        type: 'search' as const,
        showNewButton: false,
        showFilter: true,
        searchPlaceholder: 'Pesquisar histórico...',
        filterOptions: [
            { value: '', label: 'Todos os eventos' },
            { value: 'login', label: 'Login' },
            { value: 'logout', label: 'Logout' },
            { value: 'create', label: 'Nova senha' },
            { value: 'edit', label: 'Edição' },
            { value: 'delete', label: 'Exclusão' },
            { value: 'password', label: 'Senha' },
            { value: 'device', label: 'Dispositivo' },
        ],
    },
    settings: {
        icon: <SettingsIcon className="w-6 h-6 text-accent" />,
        bgColor: 'bg-accent/10',
        defaultTitle: 'Configurações',
        defaultSubtitle: 'Personalize sua experiência',
        type: 'simple' as const,
    },
};

const Header: React.FC<HeaderProps> = ({
    variant,
    title,
    subtitle,
    credentialCount = 0,
    onMenuClick,
    onSearch,
    onNewCredential,
    showNewButton,
    hideMobile = false,
    filterOptions,
}) => {
    const config = headerConfig[variant];

    if (!config) {
        console.error(`Variante de header não encontrada: ${variant}`);
        return null;
    }

    const displayTitle = title || config.defaultTitle;
    const displaySubtitle =
        subtitle ||
        (typeof config.defaultSubtitle === 'function'
            ? config.defaultSubtitle(credentialCount)
            : config.defaultSubtitle);

    const finalFilterOptions = filterOptions || config.filterOptions;

    const renderContentHeader = () => {
        switch (config.type) {
            case 'search':
                return (
                    <HeaderSearch
                        icon={config.icon}
                        iconBgColor={config.bgColor}
                        title={displayTitle}
                        subtitle={displaySubtitle}
                        onSearch={onSearch}
                        onNewCredential={onNewCredential}
                        showNewButton={
                            showNewButton !== undefined
                                ? showNewButton
                                : config.showNewButton
                        }
                        showFilter={config.showFilter}
                        searchPlaceholder={
                            config.searchPlaceholder || 'Pesquisar...'
                        }
                        filterOptions={finalFilterOptions}
                    />
                );

            case 'simple':
                return (
                    <HeaderSimple
                        icon={config.icon}
                        iconBgColor={config.bgColor}
                        title={displayTitle}
                        subtitle={displaySubtitle}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <>
            {!hideMobile && <HeaderMobile onMenuClick={onMenuClick} />}

            {renderContentHeader()}
        </>
    );
};

export default Header;
