export function validateInfo(info: Uint8Array): void {
    if (!(info instanceof Uint8Array)) {
        throw new Error('info deve ser Uint8Array');
    }

    if (info.length === 0) {
        throw new Error('info não pode estar vazio');
    }

    if (info.length > 1024) {
        throw new Error('info muito grande');
    }
}
