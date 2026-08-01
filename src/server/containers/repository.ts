import { prisma } from '../database/prisma/prisma';
import { AuditRepository } from '../database/repositories/audit.repository';
import { AuthRepository } from '../database/repositories/auth.repository';

export const authRepository = new AuthRepository(prisma);
export const auditRepository = new AuditRepository(prisma);
