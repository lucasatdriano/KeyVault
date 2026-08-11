import { PrismaClient, User } from '@/src/generated/prisma/client';
import { UpdateUserData } from '../../types/repository/user';

export class UserRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findById(userId: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async update(userId: string, data: UpdateUserData): Promise<User> {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data,
        });
    }

    async updateName(userId: string, name: string): Promise<User> {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name,
            },
        });
    }

    async updateEmail(userId: string, email: string): Promise<User> {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                email,
            },
        });
    }
}
