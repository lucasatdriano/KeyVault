import { EMAIL_REGEX } from '@/src/shared/constants/auth/auth.constants';
import { ChangePasswordFormData } from '@/src/shared/types/auth';
import { ValidateChangeEmailData } from '@/src/shared/types/profile';

import { ValidationErrors } from '@/src/client/validators';

export function validateName(name: string): ValidationErrors<{ name: string }> {
    const errors: ValidationErrors<{ name: string }> = {};

    const trimmedName = name.trim();

    if (!trimmedName) {
        errors.name = 'O nome não pode estar vazio.';
    } else if (trimmedName.length < 2) {
        errors.name = 'O nome deve ter pelo menos 2 caracteres.';
    } else if (trimmedName.length > 100) {
        errors.name = 'O nome deve ter no máximo 100 caracteres.';
    }

    return errors;
}

export function validateChangeEmail(
    data: ValidateChangeEmailData,
): ValidationErrors<ValidateChangeEmailData> {
    const errors: ValidationErrors<ValidateChangeEmailData> = {};

    const normalizedEmail = data.newEmail.trim().toLowerCase();

    if (!normalizedEmail) {
        errors.newEmail = 'O novo e-mail é obrigatório.';
    } else if (!EMAIL_REGEX.test(normalizedEmail)) {
        errors.newEmail = 'Digite um e-mail válido.';
    } else if (normalizedEmail === data.currentEmail.toLowerCase()) {
        errors.newEmail = 'O novo e-mail deve ser diferente do atual.';
    }

    if (!data.password.trim()) {
        errors.password = 'A senha atual é obrigatória.';
    }

    return errors;
}

export function validateChangePassword(
    data: ChangePasswordFormData,
): ValidationErrors<ChangePasswordFormData> {
    const errors: ValidationErrors<ChangePasswordFormData> = {};

    if (!data.currentPassword.trim()) {
        errors.currentPassword = 'A senha atual é obrigatória.';
    }

    if (!data.newPassword.trim()) {
        errors.newPassword = 'A nova senha é obrigatória.';
    } else if (data.newPassword.length < 8) {
        errors.newPassword = 'A senha deve ter pelo menos 8 caracteres.';
    } else if (data.newPassword === data.currentPassword) {
        errors.newPassword = 'A nova senha deve ser diferente da atual.';
    }

    if (!data.confirmPassword.trim()) {
        errors.confirmPassword = 'Confirme sua nova senha.';
    } else if (data.newPassword !== data.confirmPassword) {
        errors.confirmPassword = 'As senhas não coincidem.';
    }

    return errors;
}
