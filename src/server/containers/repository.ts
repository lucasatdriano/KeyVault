import { prisma } from '../database/prisma/prisma';

import { AuditRepository } from '../database/repositories/audit.repository';
import { AuthRepository } from '../database/repositories/auth.repository';
import { CategoryRepository } from '../database/repositories/category.repository';
import { CredentialRepository } from '../database/repositories/credential.repository';
import { EmailVerificationRepository } from '../database/repositories/emailVerification.repository';
import { RecoveryRepository } from '../database/repositories/recovery.repository';
import { UserRepository } from '../database/repositories/user.repository';

export const authRepository = new AuthRepository(prisma);

export const emailVerificationRepository = new EmailVerificationRepository(
    prisma,
);

export const userRepository = new UserRepository(prisma);

export const recoveryRepository = new RecoveryRepository(prisma);

export const credentialRepository = new CredentialRepository(prisma);

export const categoryRepository = new CategoryRepository(prisma);

export const auditRepository = new AuditRepository(prisma);
