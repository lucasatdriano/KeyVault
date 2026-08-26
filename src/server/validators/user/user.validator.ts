export function validateUserId(userId: string): void {
    if (!userId || typeof userId !== 'string') {
        throw new Error('userId inválido');
    }
}
