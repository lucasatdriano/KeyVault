export interface CreateEmailVerificationData {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
}
