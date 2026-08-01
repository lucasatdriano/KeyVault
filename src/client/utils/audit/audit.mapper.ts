import { AuditAction } from '@/src/generated/prisma/enums';
import { AuditLog, AuditLogResponse } from '@/src/client/types/audit';

const actionMap: Record<
    AuditAction,
    {
        type: AuditLog['type'];
        event: (resource?: string | null) => string;
        details: () => string;
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

export function mapAuditLog(log: AuditLogResponse): AuditLog {
    const config = actionMap[log.action];

    return {
        id: log.id,

        date: log.createdAt.toLocaleDateString('sv-SE'),

        time: log.createdAt.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        }),

        event: config.event(),

        details: config.details(),

        type: config.type,

        os: log.os ?? '--',

        device:
            [log.browser, log.os, log.device].filter(Boolean).join(' • ') ||
            'Desconhecido',

        ip: log.ip ?? '--',
    };
}
