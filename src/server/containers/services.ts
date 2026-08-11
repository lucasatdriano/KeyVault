import {
    auditRepository,
    authRepository,
    categoryRepository,
    credentialRepository,
    emailVerificationRepository,
    recoveryRepository,
    userRepository,
} from './repository';

import { AuditService } from '../services/audit.service';
import { AuthService } from '../services/auth/auth.service';
import { JWTService } from '../services/auth/jwt.service';
import { CategoryService } from '../services/category.service';
import { CredentialService } from '../services/credential.service';
import { RecoveryService } from '../services/recovery.service';
import { UserService } from '../services/user.service';
import { EmailService } from '../services/auth/email.service';

export const jwtService = new JWTService(process.env.JWT_SECRET);

export const auditService = new AuditService(auditRepository);

export const categoryService = new CategoryService(categoryRepository);

export const emailService = new EmailService(process.env.RESEND_API_KEY);

export const authService = new AuthService(
    authRepository,
    emailVerificationRepository,
    emailService,
    jwtService,
    auditService,
    categoryService,
);

export const userService = new UserService(
    userRepository,
    recoveryRepository,
    auditService,
);

export const recoveryService = new RecoveryService(
    recoveryRepository,
    authRepository,
    auditService,
);

export const credentialService = new CredentialService(
    credentialRepository,
    auditService,
);
