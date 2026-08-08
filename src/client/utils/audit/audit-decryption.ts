import { decryptString } from '@/src/shared/crypto/cipher';
import { AuditLog } from '@/src/client/types/audit';
import { mapAuditLog } from '@/src/client/utils/audit/audit.mapper';
import { AuditLogWithCredential } from '@/src/server/types/repository/audit';

interface DecryptAuditLogParams {
    log: AuditLogWithCredential;
    vaultKey: Uint8Array;
}

export async function decryptAuditLog({
    log,
    vaultKey,
}: DecryptAuditLogParams): Promise<AuditLog> {
    let resource = null;

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

    return mapAuditLog({
        ...log,
        resource,
    });
}

export async function decryptAuditLogs({
    logs,
    vaultKey,
}: {
    logs: AuditLogWithCredential[];
    vaultKey: Uint8Array;
}): Promise<AuditLog[]> {
    return Promise.all(logs.map((log) => decryptAuditLog({ log, vaultKey })));
}
