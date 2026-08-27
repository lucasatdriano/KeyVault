export function validateSecret(secret: string): void {
    if (typeof secret !== 'string') {
        throw new Error('secret deve ser string');
    }

    if (secret.trim().length === 0) {
        throw new Error('secret não pode ser vazia');
    }

    if (secret.length > 512) {
        throw new Error('secret muito longa');
    }
}
