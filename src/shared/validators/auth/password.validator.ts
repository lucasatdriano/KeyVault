export function validatePassword(password: string): void {
    if (typeof password !== 'string') {
        throw new Error('password deve ser string');
    }

    if (password.trim().length === 0) {
        throw new Error('password não pode ser vazia');
    }

    if (password.length > 512) {
        throw new Error('password muito longa');
    }
}
