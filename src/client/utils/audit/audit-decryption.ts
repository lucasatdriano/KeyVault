import { decryptString } from '@/src/shared/crypto/cipher';
import { AuditLog } from '@/src/client/types/audit';
import { mapAuditLog } from '@/src/client/utils/audit/audit.mapper';
import { AuditLogWithCredentialWithRecoveryMethod } from '@/src/server/types/repository/audit';
import { RecoveryType } from '@/src/generated/prisma/enums';

interface DecryptAuditLogParams {
    log: AuditLogWithCredentialWithRecoveryMethod;
    vaultKey: Uint8Array;
}

export async function decryptAuditLog({
    log,
    vaultKey,
}: DecryptAuditLogParams): Promise<AuditLog> {
    let resource = null;
    let recoveryType: RecoveryType | null = null;

    if (log.credential && vaultKey) {
        try {
            const json = await decryptString(
                {
                    cipherText: log.credential.cipherText,
                    iv: log.credential.iv,
                },
                vaultKey,
            );

            const credential = JSON.parse(json);
            resource = credential.title;
        } catch (error) {
            console.error('Erro ao descriptografar credencial do log:', error);
        }
    }

    if (log.recoveryMethod) {
        recoveryType = log.recoveryMethod.type as RecoveryType;
    }

    const auditLogResponse = {
        ...log,
        resource,
        recoveryType,
    };

    return mapAuditLog(auditLogResponse);
}

export async function decryptAuditLogs({
    logs,
    vaultKey,
}: {
    logs: AuditLogWithCredentialWithRecoveryMethod[];
    vaultKey: Uint8Array;
}): Promise<AuditLog[]> {
    return Promise.all(logs.map((log) => decryptAuditLog({ log, vaultKey })));
}
