import {
    CreateCredentialData,
    UpdateCredentialData,
} from '@/src/server/types/repository/credential';

export function validateCreateCredentialData(data: CreateCredentialData): void {
    if (!data.userId) {
        throw new Error('Usuário inválido.');
    }

    if (!data.cipherText?.trim()) {
        throw new Error('Credencial inválida.');
    }

    if (!data.iv?.trim()) {
        throw new Error('IV inválido.');
    }

    if (!data.salt?.trim()) {
        throw new Error('Salt inválido.');
    }

    if (!data.algorithm?.trim()) {
        throw new Error('Algoritmo inválido.');
    }
}

export function validateUpdateCredentialData(data: UpdateCredentialData): void {
    if (!data.id) {
        throw new Error('Credencial inválida.');
    }

    if (
        data.cipherText === undefined &&
        data.iv === undefined &&
        data.salt === undefined &&
        data.categoryId === undefined &&
        data.favorite === undefined
    ) {
        throw new Error('Nenhum campo informado.');
    }
}
