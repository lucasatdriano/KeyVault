import { PrismaClient } from '@/src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import argon2 from 'argon2';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const adminPassword = await argon2.hash('Admin123456!');

    await prisma.user.upsert({
        where: {
            email: 'admin@keyvault.com',
        },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@keyvault.com',
            passwordHash: adminPassword,
            emailVerified: true,
        },
    });

    console.log('✅ Seed executado com sucesso!');
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
