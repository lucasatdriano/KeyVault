export function getRecoveryLevel(activeMethodsCount: number) {
    if (activeMethodsCount >= 3) {
        return {
            label: 'Alto',
            color: 'text-green-500',
            background: 'bg-green-500/10',
        };
    }

    if (activeMethodsCount >= 2) {
        return {
            label: 'Médio',
            color: 'text-yellow-500',
            background: 'bg-yellow-500/10',
        };
    }

    return {
        label: 'Baixo',
        color: 'text-error',
        background: 'bg-error/10',
    };
}
