import { EMAIL_REGEX } from "@/src/shared/constants/auth/auth.constants";

export function validateEmailData(email: string): void {
    if (!email || typeof email !== 'string') {
        throw new Error('Email é obrigatório');
    }

    if (!EMAIL_REGEX.test(email)) {
        throw new Error('Email inválido');
    }
}
