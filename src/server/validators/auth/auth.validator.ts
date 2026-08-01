import {
    ChangePasswordData,
    LoginData,
    RegisterData,
} from '@/src/shared/types/auth';
import {} from '../../types/service/auth';

export function validateRegisterData(data: RegisterData): void {
    if (!data.name || typeof data.name !== 'string' || data.name.length < 2) {
        throw new Error('Nome deve ter pelo menos 2 caracteres');
    }

    if (!data.email || typeof data.email !== 'string') {
        throw new Error('Email é obrigatório');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        throw new Error('Email inválido');
    }

    if (!data.password || typeof data.password !== 'string') {
        throw new Error('Senha é obrigatória');
    }

    if (data.password.length < 8) {
        throw new Error('Senha deve ter pelo menos 8 caracteres');
    }
}

export function validateLoginData(data: LoginData): void {
    if (!data.email || typeof data.email !== 'string') {
        throw new Error('Email é obrigatório');
    }

    if (!data.password || typeof data.password !== 'string') {
        throw new Error('Senha é obrigatória');
    }
}

export function validateChangePasswordData(data: ChangePasswordData): void {
    if (!data.userId || typeof data.userId !== 'string') {
        throw new Error('userId inválido');
    }

    if (!data.currentPassword || typeof data.currentPassword !== 'string') {
        throw new Error('Senha atual é obrigatória');
    }

    if (!data.newPassword || typeof data.newPassword !== 'string') {
        throw new Error('Nova senha é obrigatória');
    }

    if (data.newPassword.length < 8) {
        throw new Error('Nova senha deve ter pelo menos 8 caracteres');
    }

    if (data.currentPassword === data.newPassword) {
        throw new Error('A nova senha deve ser diferente da atual');
    }
}
