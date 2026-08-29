import {
    auditRepository,
    categoryRepository,
    recoveryRepository,
    emailVerificationRepository,
    authRepository,
    userRepository,
    credentialRepository,
    sessionRepository,
} from '@/src/server/containers/repository';

import { RecoverySettingsService } from '@/src/server/services/recovery/recovery-settings.service';
import { RecoverySessionService } from '@/src/server/services/recovery/recovery-session.service';
import { RecoveryFlowService } from '@/src/server/services/recovery/recovery-flow.service';
import { CredentialService } from '@/src/server/services/credential.service';
import { SessionService } from '@/src/server/services/auth/session.service';
import { CategoryService } from '@/src/server/services/category.service';
import { EmailService } from '@/src/server/services/auth/email.service';
import { AuthService } from '@/src/server/services/auth/auth.service';
import { JWTService } from '@/src/server/services/auth/jwt.service';
import { AuditService } from '@/src/server/services/audit.service';
import { UserService } from '@/src/server/services/user.service';

export const jwtService = new JWTService(process.env.JWT_SECRET);

export const auditService = new AuditService(auditRepository);

export const sessionService = new SessionService(
    sessionRepository,
    auditService,
);

export const categoryService = new CategoryService(categoryRepository);

export const recoverySessionService = new RecoverySessionService(
    recoveryRepository,
);

export const recoveryFlowService = new RecoveryFlowService(
    recoveryRepository,
    authRepository,
    userRepository,
    recoverySessionService,
);

export const recoverySettingsService = new RecoverySettingsService(
    recoveryRepository,
    userRepository,
    auditService,
);

export const emailService = new EmailService(process.env.RESEND_API_KEY);

export const authService = new AuthService(
    authRepository,
    emailVerificationRepository,
    sessionService,
    emailService,
    jwtService,
    auditService,
    recoverySettingsService,
    categoryService,
);

export const userService = new UserService(
    userRepository,
    authRepository,
    recoveryRepository,
    emailVerificationRepository,
    emailService,
    auditService,
);

export const credentialService = new CredentialService(
    credentialRepository,
    auditService,
);
