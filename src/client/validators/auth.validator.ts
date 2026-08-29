import { EMAIL_REGEX } from '@/src/shared/constants/auth/auth.constants';
import { LoginFormData, RegisterFormData } from '@/src/shared/types/auth';

import { ValidationErrors } from '@/src/client/validators';

export function validateLoginForm(
    data: LoginFormData,
): ValidationErrors<LoginFormData> {
    const errors: ValidationErrors<LoginFormData> = {};

    if (!data.email.trim()) {
        errors.email = 'Informe seu e-mail.';
    } else if (!EMAIL_REGEX.test(data.email)) {
        errors.email = 'Digite um e-mail válido.';
    }

    if (!data.password) {
        errors.password = 'Informe sua senha.';
    }

    return errors;
}

export function validateRegisterForm(
    data: RegisterFormData & { confirmPassword: string },
    acceptTerms: boolean,
): ValidationErrors<RegisterFormData> {
    const errors: ValidationErrors<RegisterFormData & { terms: string }> = {};

    if (!data.name.trim()) {
        errors.name = 'Informe seu nome.';
    } else if (data.name.length < 2) {
        errors.name = 'O nome deve ter pelo menos 2 caracteres.';
    }

    if (!data.email.trim()) {
        errors.email = 'Informe seu e-mail.';
    } else if (!EMAIL_REGEX.test(data.email)) {
        errors.email = 'Digite um e-mail válido.';
    }

    if (!data.password) {
        errors.password = 'Informe sua senha.';
    } else if (data.password.length < 8) {
        errors.password = 'A senha deve ter pelo menos 8 caracteres.';
    }

    if (!data.confirmPassword) {
        errors.confirmPassword = 'Confirme sua senha.';
    } else if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'As senhas não coincidem.';
    }

    if (!acceptTerms) {
        errors.terms = 'Você precisa aceitar os termos.';
    }

    return errors;
}
