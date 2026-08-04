import { prisma } from '../database/prisma/prisma';
import { AuditRepository } from '../database/repositories/audit.repository';
import { AuthRepository } from '../database/repositories/auth.repository';
import { CategoryRepository } from '../database/repositories/category.repository';
import { CredentialRepository } from '../database/repositories/credential.repository';

export const authRepository = new AuthRepository(prisma);

export const auditRepository = new AuditRepository(prisma);

export const credentialRepository = new CredentialRepository(prisma);

export const categoryRepository = new CategoryRepository(prisma);
