import { AuditService } from '../services/audit.service';
import { AuthService } from '../services/auth/auth.service';
import { JWTService } from '../services/auth/jwt.service';
import { auditRepository, authRepository } from './repository';

export const jwtService = new JWTService(process.env.JWT_SECRET);

export const auditService = new AuditService(auditRepository);

export const authService = new AuthService(
    authRepository,
    jwtService,
    auditService,
);
