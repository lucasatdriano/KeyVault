import argon2 from 'argon2';

/**
 * Hash da senha com Argon2id
 * @param password - Senha em texto puro
 * @returns Promise<string> - Hash da senha
 */
export async function hashPassword(password: string): Promise<string> {
    if (!password || password.length === 0) {
        throw new Error('A senha não pode estar vazia');
    }

    const strength = isPasswordStrong(password);
    if (!strength.valid) {
        throw new Error(`Senha fraca: ${strength.errors.join(', ')}`);
    }

    const hash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 4,
    });

    return hash;
}

/**
 * Verificar se a senha corresponde ao hash
 * @param password - Senha em texto puro
 * @param hash - Hash armazenado
 * @returns Promise<boolean> - True se a senha corresponder
 */
export async function verifyPassword(
    password: string,
    hash: string,
): Promise<boolean> {
    try {
        if (!password || !hash) {
            throw new Error('Senha e hash são obrigatórios');
        }

        if (!hash.startsWith('$argon2')) {
            throw new Error('Hash inválido ou formato não suportado');
        }

        const isValid = await argon2.verify(hash, password);
        return isValid;
    } catch (error) {
        console.error('Erro ao verificar senha:', error);
        throw error;
    }
}

/**
 * Verifica a força da senha
 * @param password - Senha em texto puro
 * @returns Object - { valid: boolean, errors: string[] }
 */
export function isPasswordStrong(password: string): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('A senha deve ter pelo menos 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('A senha deve conter pelo menos uma letra minúscula');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('A senha deve conter pelo menos um número');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};:'"\\|,.<>/?]/.test(password)) {
        errors.push('A senha deve conter pelo menos um caractere especial');
    }

    if (/\s/.test(password)) {
        errors.push('A senha não pode conter espaços');
    }

    const commonPasswords = [
        '123456',
        '12345678',
        'qwerty',
        '123456789',
        '12345',
        '1234',
        '111111',
        '1234567',
        '123123',
        'abc123',
        'senha',
        'master',
        '666666',
        '123321',
        '1234567890',
        '654321',
        '121212',
        '000000',
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
        errors.push(
            'Esta é uma senha muito comum. Escolha uma senha mais única',
        );
    }

    const sequences = [
        '12345678',
        '87654321',
        'abcdefgh',
        'qwertyui',
        'asdfghjk',
        'zxcvbnm',
    ];
    for (const seq of sequences) {
        if (password.toLowerCase().includes(seq)) {
            errors.push('A senha contém sequências previsíveis');
            break;
        }
    }

    const score = calculatePasswordStrength(password);
    if (score < 60) {
        errors.push(
            `A senha é muito fraca (score: ${score}/100). Tente uma senha mais complexa`,
        );
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Calcula a força da senha em uma escala de 0-100
 * @param password - Senha em texto puro
 * @returns number - Score de força (0-100)
 */
export function calculatePasswordStrength(password: string): number {
    let score = 0;

    const criteria = [
        { regex: /.{8,}/, points: 10 },
        { regex: /.{12,}/, points: 10 },
        { regex: /.{16,}/, points: 10 },
        { regex: /[A-Z]/, points: 10 },
        { regex: /[a-z]/, points: 10 },
        { regex: /[0-9]/, points: 10 },
        { regex: /[!@#$%^&*()_+\-=\[\]{};:'"\\|,.<>/?]/, points: 15 },
        { regex: /[^A-Za-z0-9]/, points: 5 },
        { regex: /.{20,}/, points: 10 },
        {
            regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
            points: 10,
        },
    ];

    for (const criterion of criteria) {
        if (criterion.regex.test(password)) {
            score += criterion.points;
        }
    }

    if (/(.)\1{2,}/.test(password)) score -= 10;
    if (/123|abc|qwerty|asdf|zxcv/.test(password.toLowerCase())) score -= 15;

    return Math.max(0, Math.min(100, score));
}

/**
 * Versão síncrona (sem verificação assíncrona)
 * Útil para validação rápida em formulários
 */
export function isPasswordStrongSync(password: string): {
    valid: boolean;
    errors: string[];
} {
    return isPasswordStrong(password);
}
