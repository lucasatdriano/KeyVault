export function isCryptoSupported(): boolean {
    return (
        typeof globalThis.crypto !== 'undefined' &&
        typeof globalThis.crypto.subtle !== 'undefined'
    );
}

export function assertCryptoSupport(): void {
    if (!isCryptoSupported()) {
        throw new Error('Web Crypto API não está disponível neste ambiente.');
    }
}

export function getCrypto(): Crypto {
    assertCryptoSupport();

    return globalThis.crypto;
}

export function getSubtle(): SubtleCrypto {
    return getCrypto().subtle;
}

export function toArrayBuffer(data: Uint8Array): ArrayBuffer {
    return data.buffer.slice(
        data.byteOffset,
        data.byteOffset + data.byteLength,
    ) as ArrayBuffer;
}

export function cloneBytes(data: Uint8Array): Uint8Array {
    return new Uint8Array(toArrayBuffer(data));
}

export function toUint8Array(
    buffer: ArrayBuffer | ArrayBufferLike,
): Uint8Array {
    return new Uint8Array(buffer);
}
