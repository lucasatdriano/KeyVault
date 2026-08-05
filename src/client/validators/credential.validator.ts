import { CreateCredentialData } from '@/src/shared/types/credential';

export function validateCredentialForm(data: CreateCredentialData) {
    const errors: Record<string, string> = {};

    if (!data.title.trim()) {
        errors.title = 'Informe um título.';
    } else if (data.title.trim().length < 2) {
        errors.title = 'O título deve ter pelo menos 2 caracteres.';
    }

    if (!data.username?.trim() && !data.email?.trim()) {
        errors.username = 'Informe um usuário ou e-mail.';
    }

    if (data.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Digite um e-mail válido.';
    }

    if (!data.password) {
        errors.password = 'Informe uma senha.';
    }

    if (
        data.url?.trim() &&
        !/^https?:\/\/([\w-]+\.)+[\w-]{2,}(\/.*)?$/i.test(data.url)
    ) {
        errors.url = 'Informe uma URL válida.';
    }

    if (!data.categoryId == null) {
        errors.category = 'Selecione uma categoria.';
    }

    if (data.notes && data.notes.length > 1000) {
        errors.notes = 'As notas podem ter no máximo 1000 caracteres.';
    }

    return errors;
}
