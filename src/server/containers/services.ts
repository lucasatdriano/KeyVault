import { AuditService } from '../services/audit.service';
import { AuthService } from '../services/auth/auth.service';
import { JWTService } from '../services/auth/jwt.service';
import { CategoryService } from '../services/category.service';
import { CredentialService } from '../services/credential.service';
import {
    auditRepository,
    authRepository,
    categoryRepository,
    credentialRepository,
} from './repository';

export const jwtService = new JWTService(process.env.JWT_SECRET);

export const auditService = new AuditService(auditRepository);

export const categoryService = new CategoryService(categoryRepository);

export const authService = new AuthService(
    authRepository,
    jwtService,
    auditService,
    categoryService,
);

export const credentialService = new CredentialService(
    credentialRepository,
    auditService,
);
