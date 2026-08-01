import { AuditAction, AuditLog } from '@/src/generated/prisma/client';
import { AuditLog as AuditCardLog } from '../components/ui/cards/AuditCard';

const actionMap: Record<
    AuditAction,
    {
        type: AuditCardLog['type'];
        event: (resource?: string | null) => string;
        details: (log: AuditLog) => string | undefined;
    }
> = {
    REGISTER: {
        type: 'create',
        event: () => 'Conta criada',
        details: () => 'Cadastro realizado com sucesso.',
    },

    VERIFY_EMAIL: {
        type: 'edit',
        event: () => 'E-mail verificado',
        details: () => 'O endereço de e-mail foi confirmado.',
    },

    LOGIN: {
        type: 'login',
        event: () => 'Login realizado com sucesso',
        details: () => 'Autenticação realizada.',
    },

    LOGOUT: {
        type: 'logout',
        event: () => 'Logout realizado',
        details: () => 'Sessão encerrada.',
    },

    CREATE_CREDENTIAL: {
        type: 'create',
        event: (resource) =>
            `Nova credencial adicionada${resource ? `: ${resource}` : ''}`,
        details: () => 'Credencial criada.',
    },

    UPDATE_CREDENTIAL: {
        type: 'edit',
        event: (resource) =>
            `Credencial editada${resource ? `: ${resource}` : ''}`,
        details: () => 'Credencial atualizada.',
    },

    DELETE_CREDENTIAL: {
        type: 'delete',
        event: (resource) =>
            `Credencial removida${resource ? `: ${resource}` : ''}`,
        details: () => 'Credencial removida.',
    },

    COPY_PASSWORD: {
        type: 'edit',
        event: (resource) => `Senha copiada${resource ? `: ${resource}` : ''}`,
        details: () => 'A senha foi copiada.',
    },

    CHANGE_MASTER_PASSWORD: {
        type: 'password',
        event: () => 'Senha mestre alterada',
        details: () => 'A senha mestre foi atualizada.',
    },

    EXPORT_DATA: {
        type: 'edit',
        event: () => 'Dados exportados',
        details: () => 'Exportação do cofre realizada.',
    },

    IMPORT_DATA: {
        type: 'create',
        event: () => 'Dados importados',
        details: () => 'Importação realizada.',
    },

    RESET_PASSWORD: {
        type: 'password',
        event: () => 'Senha redefinida',
        details: () => 'A senha foi redefinida.',
    },

    RECOVERY: {
        type: 'password',
        event: () => 'Recuperação da conta',
        details: () => 'Método de recuperação utilizado.',
    },
};

export function mapAuditLog(log: AuditLog): AuditCardLog {
    const config = actionMap[log.action];

    const date = new Date(log.createdAt);

    return {
        id: log.id,

        date: date.toLocaleDateString('sv-SE'),

        time: date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        }),

        event: config.event(undefined),

        details: config.details(log),

        type: config.type,

        device:
            [log.browser, log.os, log.device].filter(Boolean).join(' • ') ||
            'Desconhecido',

        ip: log.ip ?? '--',
    };
}
