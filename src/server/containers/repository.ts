import { prisma } from '@/src/server/database/prisma/prisma';

import { EmailVerificationRepository } from '@/src/server/database/repositories/emailVerification.repository';
import { CredentialRepository } from '@/src/server/database/repositories/credential.repository';
import { RecoveryRepository } from '@/src/server/database/repositories/recovery.repository';
import { CategoryRepository } from '@/src/server/database/repositories/category.repository';
import { SessionRepository } from '@/src/server/database/repositories/session.repository';
import { AuditRepository } from '@/src/server/database/repositories/audit.repository';
import { AuthRepository } from '@/src/server/database/repositories/auth.repository';
import { UserRepository } from '@/src/server/database/repositories/user.repository';

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
