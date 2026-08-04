import { AuditAction } from '@/src/generated/prisma/enums';

export const ACTION_MAP: Record<string, AuditAction> = {
    login: AuditAction.LOGIN,

    logout: AuditAction.LOGOUT,

    register: AuditAction.REGISTER,
    cadastro: AuditAction.REGISTER,

    create: AuditAction.CREATE_CREDENTIAL,
    criar: AuditAction.CREATE_CREDENTIAL,
    criada: AuditAction.CREATE_CREDENTIAL,

    copy: AuditAction.COPY_PASSWORD,
    copiar: AuditAction.COPY_PASSWORD,

    edit: AuditAction.UPDATE_CREDENTIAL,
    editar: AuditAction.UPDATE_CREDENTIAL,
    atualizar: AuditAction.UPDATE_CREDENTIAL,
    atualizada: AuditAction.UPDATE_CREDENTIAL,

    delete: AuditAction.DELETE_CREDENTIAL,
    deletada: AuditAction.DELETE_CREDENTIAL,
    excluida: AuditAction.DELETE_CREDENTIAL,

    password: AuditAction.CHANGE_MASTER_PASSWORD,
    master: AuditAction.CHANGE_MASTER_PASSWORD,
    mestre: AuditAction.CHANGE_MASTER_PASSWORD,

    email: AuditAction.VERIFY_EMAIL,
    verificar: AuditAction.VERIFY_EMAIL,
};
