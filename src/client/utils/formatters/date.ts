export function formatDateOnly(date: string) {
    const [year, month, day] = date.split('-');

    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
    ).toLocaleDateString('pt-BR', {
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
