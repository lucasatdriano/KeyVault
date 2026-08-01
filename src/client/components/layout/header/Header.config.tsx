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
import { HeaderConfig, HeaderVariant } from '@/src/client/types/header';

export const headerVariants: Record<HeaderVariant, HeaderConfig> = {
    search: {
        icon: KeyIcon,
        iconClass: 'text-primary',
        bgColor: 'bg-primary/10',
        defaultTitle: 'Minhas Credenciais',
        defaultSubtitle: (count) => `${count} Credenciais`,
        type: 'search',
        showNewButton: true,
        showFilter: true,
        searchPlaceholder: 'Pesquisar credenciais...',
    },

    favorites: {
        icon: StarIcon,
        iconClass: 'text-warning',
        bgColor: 'bg-warning/10',
        defaultTitle: 'Favoritos',
        defaultSubtitle: (count) => `${count} Credenciais favoritas`,
        type: 'search',
        showNewButton: false,
        showFilter: true,
        searchPlaceholder: 'Pesquisar favoritos...',
    },

    trash: {
        icon: Trash2Icon,
        iconClass: 'text-error',
        bgColor: 'bg-error/10',
        defaultTitle: 'Lixeira',
        defaultSubtitle: (count) => `${count} Credenciais na lixeira`,
        type: 'search',
        showNewButton: false,
        showFilter: true,
        searchPlaceholder: 'Pesquisar na lixeira...',
    },

    account: {
        icon: UserIcon,
        iconClass: 'text-primary',
        bgColor: 'bg-primary/10',
        defaultTitle: 'Conta',
        defaultSubtitle: 'Gerencie suas informações',
        type: 'simple',
    },

    security: {
        icon: ShieldIcon,
        iconClass: 'text-success',
        bgColor: 'bg-success/10',
        defaultTitle: 'Segurança',
        defaultSubtitle: 'Proteja sua conta',
        type: 'simple',
    },

    recovery: {
        icon: FingerprintIcon,
        iconClass: 'text-danger',
        bgColor: 'bg-danger/10',
        defaultTitle: 'Recuperação',
        defaultSubtitle: 'Opções de recuperação',
        type: 'simple',
    },

    audit: {
        icon: ActivityIcon,
        iconClass: 'text-purple',
        bgColor: 'bg-purple/10',
        defaultTitle: 'Auditoria',
        defaultSubtitle: 'Histórico de atividades',
        type: 'search',
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
        icon: SettingsIcon,
        iconClass: 'text-accent',
        bgColor: 'bg-accent/10',
        defaultTitle: 'Configurações',
        defaultSubtitle: 'Personalize sua experiência',
        type: 'simple',
    },
};
