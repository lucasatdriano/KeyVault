export function validateNameData(name: string): void {
    if (!name || typeof name !== 'string') {
        throw new Error('Nome é obrigatório');
    }

    const normalized = name.trim();

    if (normalized.length < 2) {
        throw new Error('Nome deve ter pelo menos 2 caracteres.');
    }

    if (normalized.length > 100) {
        throw new Error('Nome deve ter no máximo 100 caracteres.');
    }
}
