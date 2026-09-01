export function formatDateOnly(date: string | Date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        console.error('Data inválida:', date);
        return 'Data inválida';
    }

    return dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

export function formatDateTime(date: Date | string) {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export function formatShortDateTime(date: Date | string | null): string {
    if (!date) return '—';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        return '—';
    }

    return dateObj.toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    });
}

export function formatFullDateTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        return 'Data inválida';
    }

    return dateObj.toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

export function getDaysRemaining(deletedAt: string) {
    const deleted = new Date(deletedAt);
    const now = new Date();
    const diffTime =
        deleted.getTime() + 30 * 24 * 60 * 60 * 1000 - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
