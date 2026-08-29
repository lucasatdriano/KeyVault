import { AuditAction, AuditLog } from '@/src/generated/prisma/client';

import { PaginatedResponse } from '@/src/shared/types/pagination';

import { AuditRepository } from '@/src/server/database/repositories/audit.repository';
import { validateAuditData } from '@/src/server/validators/auth/audit.validator';
import { validateUserId } from '@/src/server/validators/user/user.validator';
import {
    AuditLogWithCredentialWithRecoveryMethod,
    CreateAuditLogData,
    FindUserLogsOptions,
} from '@/src/server/types/repository/audit';

export class AuditService {
    constructor(private readonly auditRepository: AuditRepository) {}

    async createLog(data: CreateAuditLogData): Promise<AuditLog> {
        validateAuditData(data);

        return this.auditRepository.create(data);
    }

    async getUserLogs(
        userId: string,
        options: FindUserLogsOptions = {},
    ): Promise<PaginatedResponse<AuditLogWithCredentialWithRecoveryMethod>> {
        validateUserId(userId);

        const result = await this.auditRepository.findByUser(userId, options);

        const credentialIds = result.data
            .map((log) => log.credentialId)
            .filter((id): id is string => Boolean(id));

        const credentials =
            await this.auditRepository.findCredentialsByIds(credentialIds);

        const credentialMap = new Map(
            credentials.map((credential) => [credential.id, credential]),
        );

        const recoveryMethodIds = result.data
            .map((log) => log.recoveryMethodId)
            .filter((id): id is string => Boolean(id));

        const recoveryMethods =
            await this.auditRepository.findRecoveryMethodsByIds(
                recoveryMethodIds,
            );

        const recoveryMethodMap = new Map(
            recoveryMethods.map((recoveryMethod) => [
                recoveryMethod.id,
                recoveryMethod,
            ]),
        );

        return {
            ...result,

            data: result.data.map((log) => ({
                ...log,

                credential: log.credentialId
                    ? (credentialMap.get(log.credentialId) ?? null)
                    : null,

                recoveryMethod: log.recoveryMethodId
                    ? (recoveryMethodMap.get(log.recoveryMethodId) ?? null)
                    : null,
            })),
        };
    }

    async getLogById(id: string): Promise<AuditLog | null> {
        if (!id) {
            throw new Error('id inválido.');
        }

        return this.auditRepository.findById(id);
    }

    async getActionStatistics(userId: string) {
        validateUserId(userId);

        return this.auditRepository.countByAction(userId);
    }

    async deleteOldLogs(
        days: number,
        actions?: AuditAction[],
    ): Promise<number> {
        if (!Number.isInteger(days) || days <= 0) {
            throw new Error('Quantidade de dias inválida.');
        }

        const date = new Date();
        date.setDate(date.getDate() - days);

        return this.auditRepository.deleteOlderThan(date, actions);
    }

    async cleanup(): Promise<number> {
        return this.deleteOldLogs(120, [AuditAction.LOGIN, AuditAction.LOGOUT]);
    }
}
