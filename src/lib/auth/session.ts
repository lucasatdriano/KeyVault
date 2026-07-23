import { prisma } from '../prisma/prisma';
import {
    deleteSessionCookie,
    getSessionCookie,
    setSessionCookie,
} from './cookies';
import { generateSessionToken } from './token';

export async function getSession(token: string) {
    return prisma.session.findUnique({
        where: {
            token,
        },
        include: {
            user: true,
        },
    });
}

export async function createSession(
    userId: string,
    remember = false,
): Promise<void> {
    const token = generateSessionToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (remember ? 30 : 7));

    await prisma.session.create({
        data: {
            token,
            userId,
            expiresAt,
            lastActivity: new Date(),
        },
    });

    await setSessionCookie(token, remember);
}

export async function updateLastActivity(sessionId: string) {
    await prisma.session.update({
        where: {
            id: sessionId,
        },
        data: {
            lastActivity: new Date(),
        },
    });
}

export async function destroySession(): Promise<void> {
    const token = await getSessionCookie();

    if (token) {
        await prisma.session.deleteMany({
            where: {
                token,
            },
        });
    }

    await deleteSessionCookie();
}
export async function validateSession(token: string) {
    const session = await getSession(token);

    if (!session) {
        return null;
    }

    if (session.expiresAt < new Date()) {
        await prisma.session.delete({
            where: {
                id: session.id,
            },
        });

        return null;
    }

    return session;
}

export async function getCurrentUser() {
    const token = await getSessionCookie();

    if (!token) {
        return null;
    }

    const session = await validateSession(token);

    if (!session) {
        await deleteSessionCookie();
        return null;
    }

    await updateLastActivity(session.id);

    return {
        user: session.user,
        session,
    };
}

export async function requireAuth() {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('Não autenticado.');
    }

    return user;
}
