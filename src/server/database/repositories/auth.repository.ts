import {
    PrismaClient,
    RecoveryType,
    User,
} from '@/src/generated/prisma/client';
import {
    CreateRecoveryMethodData,
    CreateUserData,
    UpdateRecoveryMethodData,
} from '../../types/repository/auth';

export class AuthRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async createUser(data: CreateUserData): Promise<User> {
        return this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
                encryptedVaultKey: data.encryptedVaultKey,
                isRecoverable: data.isRecoverable ?? false,
            },
        });
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async findUserById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async findUserWithRecoveryMethods(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                recoveryMethods: true,
            },
        });
    }

    async updateEmailVerification(
        userId: string,
        verified: boolean,
    ): Promise<User> {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                emailVerified: verified,
                emailVerifiedAt: verified ? new Date() : null,
            },
        });
    }

    async updatePassword(userId: string, passwordHash: string): Promise<User> {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                passwordHash,
            },
        });
    }

    async updateVaultKey(
        userId: string,
        encryptedVaultKey: string,
    ): Promise<User> {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                encryptedVaultKey,
            },
        });
    }

    async updateRecoverable(
        userId: string,
        recoverable: boolean,
    ): Promise<User> {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                isRecoverable: recoverable,
            },
        });
    }

    async deleteUser(userId: string): Promise<User> {
        return this.prisma.user.delete({
            where: {
                id: userId,
            },
        });
    }

    async createRecoveryMethod(data: CreateRecoveryMethodData) {
        return this.prisma.recoveryMethod.create({
            data,
        });
    }

    async updateRecoveryMethod(id: string, data: UpdateRecoveryMethodData) {
        return this.prisma.recoveryMethod.update({
            where: {
                id,
            },
            data,
        });
    }

    async findRecoveryMethod(userId: string, type: RecoveryType) {
        return this.prisma.recoveryMethod.findUnique({
            where: {
                userId_type: {
                    userId,
                    type,
                },
            },
        });
    }
}
