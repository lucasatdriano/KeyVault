import { AuditAction, AuditLog } from '@/src/generated/prisma/client';
import { AuditRepository } from '../database/repositories/audit.repository';
import {
    AuditLogWithCredential,
    CreateAuditLogData,
    FindUserLogsOptions,
} from '../types/repository/audit';
import { validateAuditData } from '../validators/auth/audit.validator';
import { PaginatedResponse } from '@/src/shared/types/pagination';

export class AuditService {
    constructor(private readonly auditRepository: AuditRepository) {}

    async createLog(data: CreateAuditLogData): Promise<AuditLog> {
        validateAuditData(data);

        return this.auditRepository.create(data);
    }

    async getUserLogs(
        userId: string,
        options: FindUserLogsOptions = {},
    ): Promise<PaginatedResponse<AuditLogWithCredential>> {
        if (!userId) {
            throw new Error('userId inválido.');
        }

        const result = await this.auditRepository.findByUser(userId, options);

        const credentialIds = result.data
            .map((log) => log.credentialId)
            .filter((id): id is string => Boolean(id));

        const credentials =
            await this.auditRepository.findCredentialsByIds(credentialIds);

        const credentialMap = new Map(
            credentials.map((credential) => [credential.id, credential]),
        );

        return {
            ...result,

            data: result.data.map((log) => ({
                ...log,

                credential: log.credentialId
                    ? (credentialMap.get(log.credentialId) ?? null)
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
        if (!userId) {
            throw new Error('userId inválido.');
        }

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
