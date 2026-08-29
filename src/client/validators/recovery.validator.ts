import { ValidationErrors } from '@/src/client/validators';
import {
    ForgotPasswordFormData,
    CreateQuizQuestionFormData,
    RecoveryAnswerFormData,
    RecoveryKeyFormData,
    RecoveryPasswordFormData,
    RecoveryPasswordValidationFormData,
    ResetPasswordFormData,
} from '@/src/client/types/recovery';

export function validateForgotPassword(
    data: ForgotPasswordFormData,
): ValidationErrors<ForgotPasswordFormData> {
    const errors: ValidationErrors<ForgotPasswordFormData> = {};

    const normalizedEmail = data.email.trim().toLowerCase();

    if (!normalizedEmail) {
        errors.email = 'E-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
        errors.email = 'E-mail inválido.';
    }

    return errors;
}

export function validateResetPassword(
    data: ResetPasswordFormData,
): ValidationErrors<ResetPasswordFormData> {
    const errors: ValidationErrors<ResetPasswordFormData> = {};

    if (!data.newPassword) {
        errors.newPassword = 'Nova senha é obrigatória.';
    } else if (data.newPassword.length < 8) {
        errors.newPassword = 'Senha deve ter pelo menos 8 caracteres.';
    }

    if (!data.confirmPassword) {
        errors.confirmPassword = 'Confirme sua nova senha.';
    } else if (data.newPassword !== data.confirmPassword) {
        errors.confirmPassword = 'As senhas não coincidem.';
    }

    return errors;
}

export function validateQuizQuestion(
    data: CreateQuizQuestionFormData,
): ValidationErrors<CreateQuizQuestionFormData> {
    const errors: ValidationErrors<CreateQuizQuestionFormData> = {};

    if (!data.question.trim()) {
        errors.question = 'A pergunta é obrigatória.';
    }

    if (!data.answer.trim()) {
        errors.answer = 'A resposta é obrigatória.';
    }

    return errors;
}

export function validateRecoveryAnswer(
    data: RecoveryAnswerFormData,
): ValidationErrors<RecoveryAnswerFormData> {
    const errors: ValidationErrors<RecoveryAnswerFormData> = {};

    if (!data.answer.trim()) {
        errors.answer = 'Por favor, digite sua resposta.';
    }

    return errors;
}

export function validateRecoveryKey(
    data: RecoveryKeyFormData,
): ValidationErrors<RecoveryKeyFormData> {
    const errors: ValidationErrors<RecoveryKeyFormData> = {};

    const normalizedKey = data.recoveryKey.trim().toUpperCase();

    if (!normalizedKey) {
        errors.recoveryKey = 'Digite sua chave de recuperação.';
    } else if (
        !/^KV-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}$/.test(normalizedKey)
    ) {
        errors.recoveryKey =
            'A chave de recuperação possui um formato inválido.';
    }

    return errors;
}

export function validateRecoveryPassword(
    data: RecoveryPasswordFormData,
): ValidationErrors<RecoveryPasswordFormData> {
    const errors: ValidationErrors<RecoveryPasswordFormData> = {};

    if (!data.recoveryPassword) {
        errors.recoveryPassword = 'Digite uma senha de recuperação.';
    } else if (data.recoveryPassword.length < 10) {
        errors.recoveryPassword = 'A senha deve ter pelo menos 10 caracteres.';
    } else if (!/[A-Z]/.test(data.recoveryPassword)) {
        errors.recoveryPassword =
            'A senha deve conter pelo menos uma letra maiúscula.';
    } else if (!/\d/.test(data.recoveryPassword)) {
        errors.recoveryPassword = 'A senha deve conter pelo menos um número.';
    } else if (!/[^A-Za-z0-9\s]/.test(data.recoveryPassword)) {
        errors.recoveryPassword =
            'A senha deve conter pelo menos um caractere especial.';
    }

    if (!data.confirmPassword) {
        errors.confirmPassword = 'Confirme sua senha.';
    } else if (data.recoveryPassword !== data.confirmPassword) {
        errors.confirmPassword = 'As senhas não coincidem.';
    }

    return errors;
}

export function validateRecoveryPasswordAnswer(
    data: RecoveryPasswordValidationFormData,
): ValidationErrors<RecoveryPasswordValidationFormData> {
    const errors: ValidationErrors<RecoveryPasswordValidationFormData> = {};

    if (!data.recoveryPassword.trim()) {
        errors.recoveryPassword = 'Digite sua senha de recuperação.';
    }

    return errors;
}
