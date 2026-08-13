export function validateEmailData(email: string): void {
    if (!email || typeof email !== 'string') {
        throw new Error('Email é obrigatório');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Email inválido');
    }
}
