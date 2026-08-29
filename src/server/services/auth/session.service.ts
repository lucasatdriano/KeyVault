import { AuditAction } from '@/src/generated/prisma/enums';

import { SessionRepository } from '@/src/server/database/repositories/session.repository';
import { AuditService } from '@/src/server/services/audit.service';
import { AuditContext } from '@/src/server/types/service/audit';

export class SessionService {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly auditService: AuditService,
    ) {}

    async create(userId: string, expiresAt: Date) {
        return this.sessionRepository.create(userId, expiresAt);
    }

    async logout(sessionId: string, audit?: AuditContext) {
        const session = await this.sessionRepository.findActiveById(sessionId);

        if (!session) {
            return;
        }

        await this.sessionRepository.logout(sessionId);

        await this.auditService.createLog({
            userId: session.userId,
            action: AuditAction.LOGOUT,
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });
    }

    async expireSessions() {
        const sessions =
            await this.sessionRepository.findExpiredActiveSessions();

        for (const session of sessions) {
            await this.sessionRepository.expire(session.id);

            await this.auditService.createLog({
                userId: session.userId,
                action: AuditAction.LOGOUT,
            });
        }

        return sessions.length;
    }
}
