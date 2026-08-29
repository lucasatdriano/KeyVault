import { prisma } from '../database/prisma/prisma';

import { AuditRepository } from '../database/repositories/audit.repository';
import { RecoveryRepository } from '../database/repositories/recovery.repository';
import { EmailVerificationRepository } from '../database/repositories/emailVerification.repository';
import { CategoryRepository } from '../database/repositories/category.repository';
import { AuthRepository } from '../database/repositories/auth.repository';
import { UserRepository } from '../database/repositories/user.repository';
import { CredentialRepository } from '../database/repositories/credential.repository';
import { SessionRepository } from '../database/repositories/session.repository';

export const auditRepository = new AuditRepository(prisma);

export const sessionRepository = new SessionRepository(prisma);

export const recoveryRepository = new RecoveryRepository(prisma);

export const emailVerificationRepository = new EmailVerificationRepository(
    prisma,
);

export const categoryRepository = new CategoryRepository(prisma);

export const authRepository = new AuthRepository(prisma);

export const userRepository = new UserRepository(prisma);

export const credentialRepository = new CredentialRepository(prisma);
