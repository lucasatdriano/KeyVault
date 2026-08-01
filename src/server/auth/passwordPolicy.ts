export function isPasswordStrong(password: string): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

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
