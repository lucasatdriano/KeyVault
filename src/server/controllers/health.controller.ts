import { NextResponse } from 'next/server';
import { prisma } from '../database/prisma/prisma';

export async function healthController() {
    try {
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json(
            {
                status: 'ok',
                database: 'connected',
                timestamp: new Date().toISOString(),
            },
            {
                status: 200,
            },
        );
    } catch {
        return NextResponse.json(
            {
                status: 'error',
                database: 'disconnected',
                timestamp: new Date().toISOString(),
            },
            {
                status: 500,
            },
        );
    }
}
