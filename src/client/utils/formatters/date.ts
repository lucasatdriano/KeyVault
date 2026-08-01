export function formatDate(date: string) {
    const [year, month, day] = date.split('-');

    return new Date(Number(year), Number(month) - 1, Number(day))
        .toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        .toUpperCase();
}
