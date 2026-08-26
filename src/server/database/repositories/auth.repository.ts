import { PrismaClient, User } from '@/src/generated/prisma/client';

import { CreateUserData } from '../../types/repository/auth';

export class AuthRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async createUser(data: CreateUserData): Promise<User> {
        return this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
                encryptedVaultKey: data.encryptedVaultKey,
                isRecoverable: data.isRecoverable ?? true,
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
}
