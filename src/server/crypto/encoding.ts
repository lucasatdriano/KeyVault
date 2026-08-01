export function bytesToBase64(bytes: Uint8Array): string {
    if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
        const base64 = Buffer.from(bytes).toString('base64');
        return base64
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    let binary = '';

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    const base64 = btoa(binary);

    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}

export function base64ToBytes(base64: string): Uint8Array {
    try {
        let standard = base64.replace(/-/g, '+').replace(/_/g, '/');

        while (standard.length % 4 !== 0) {
            standard += '=';
        }

        if (
            typeof Buffer !== 'undefined' &&
            typeof Buffer.from === 'function'
        ) {
            const buffer = Buffer.from(standard, 'base64');
            return new Uint8Array(buffer);
        }

        const binaryString = atob(standard);
        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        return bytes;
    } catch (error) {
        throw new Error(
            `base64ToBytes: Base64 inválido - ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        );
    }
}
