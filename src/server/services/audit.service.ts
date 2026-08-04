import { AuditAction, AuditLog } from '@/src/generated/prisma/client';
import { AuditRepository } from '../database/repositories/audit.repository';
import {
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
    ): Promise<PaginatedResponse<AuditLog>> {
        if (!userId) {
            throw new Error('userId inválido.');
        }

        return this.auditRepository.findByUser(userId, options);
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
