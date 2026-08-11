import { AuditAction } from '@/src/generated/prisma/enums';

export const ACTION_MAP: Record<string, AuditAction> = {
    login: AuditAction.LOGIN,
    logar: AuditAction.LOGIN,
    entrar: AuditAction.LOGIN,

    logout: AuditAction.LOGOUT,
    sair: AuditAction.LOGOUT,
    deslogar: AuditAction.LOGOUT,

    register: AuditAction.REGISTER,
    cadastro: AuditAction.REGISTER,
    registrar: AuditAction.REGISTER,

    'verify email': AuditAction.VERIFY_EMAIL,
    email: AuditAction.VERIFY_EMAIL,
    verificar: AuditAction.VERIFY_EMAIL,
    'confirmar email': AuditAction.VERIFY_EMAIL,
    'validar email': AuditAction.VERIFY_EMAIL,

    create: AuditAction.CREATE_CREDENTIAL,
    criar: AuditAction.CREATE_CREDENTIAL,
    criada: AuditAction.CREATE_CREDENTIAL,
    nova: AuditAction.CREATE_CREDENTIAL,
    adicionar: AuditAction.CREATE_CREDENTIAL,

    copy: AuditAction.COPY_PASSWORD,
    copiar: AuditAction.COPY_PASSWORD,
    copiada: AuditAction.COPY_PASSWORD,

    edit: AuditAction.UPDATE_CREDENTIAL,
    editar: AuditAction.UPDATE_CREDENTIAL,
    atualizar: AuditAction.UPDATE_CREDENTIAL,
    atualizada: AuditAction.UPDATE_CREDENTIAL,
    modificar: AuditAction.UPDATE_CREDENTIAL,
    alterar: AuditAction.UPDATE_CREDENTIAL,

    delete: AuditAction.DELETE_CREDENTIAL,
    deletada: AuditAction.DELETE_CREDENTIAL,
    excluida: AuditAction.DELETE_CREDENTIAL,
    remover: AuditAction.DELETE_CREDENTIAL,
    apagar: AuditAction.DELETE_CREDENTIAL,

    restore: AuditAction.RESTORE_CREDENTIAL,
    restaurar: AuditAction.RESTORE_CREDENTIAL,
    restaurada: AuditAction.RESTORE_CREDENTIAL,
    recuperar: AuditAction.RESTORE_CREDENTIAL,

    password: AuditAction.CHANGE_MASTER_PASSWORD,
    master: AuditAction.CHANGE_MASTER_PASSWORD,
    mestre: AuditAction.CHANGE_MASTER_PASSWORD,
    'trocar senha': AuditAction.CHANGE_MASTER_PASSWORD,
    'alterar senha': AuditAction.CHANGE_MASTER_PASSWORD,

    'reset password': AuditAction.RESET_PASSWORD,
    reset: AuditAction.RESET_PASSWORD,
    redefinir: AuditAction.RESET_PASSWORD,
    'redefinir senha': AuditAction.RESET_PASSWORD,

    'export data': AuditAction.EXPORT_DATA,
    export: AuditAction.EXPORT_DATA,
    exportar: AuditAction.EXPORT_DATA,
    'exportar dados': AuditAction.EXPORT_DATA,

    'import data': AuditAction.IMPORT_DATA,
    import: AuditAction.IMPORT_DATA,
    importar: AuditAction.IMPORT_DATA,
    'importar dados': AuditAction.IMPORT_DATA,

    'enable recovery': AuditAction.ENABLE_RECOVERY_METHOD,
    'ativar recuperacao': AuditAction.ENABLE_RECOVERY_METHOD,
    'habilitar recuperacao': AuditAction.ENABLE_RECOVERY_METHOD,

    'disable recovery': AuditAction.DISABLE_RECOVERY_METHOD,
    'desativar recuperacao': AuditAction.DISABLE_RECOVERY_METHOD,
    'desabilitar recuperacao': AuditAction.DISABLE_RECOVERY_METHOD,

    'generate recovery key': AuditAction.GENERATE_RECOVERY_KEY,
    'recovery key': AuditAction.GENERATE_RECOVERY_KEY,
    'gerar chave recuperacao': AuditAction.GENERATE_RECOVERY_KEY,
    'gerar chave': AuditAction.GENERATE_RECOVERY_KEY,

    'update profile': AuditAction.UPDATE_PROFILE,
    perfil: AuditAction.UPDATE_PROFILE,
    'atualizar perfil': AuditAction.UPDATE_PROFILE,
    'editar perfil': AuditAction.UPDATE_PROFILE,
    profile: AuditAction.UPDATE_PROFILE,

    'change email': AuditAction.CHANGE_EMAIL,
    'alterar email': AuditAction.CHANGE_EMAIL,
    'trocar email': AuditAction.CHANGE_EMAIL,
    'mudar email': AuditAction.CHANGE_EMAIL,
};
