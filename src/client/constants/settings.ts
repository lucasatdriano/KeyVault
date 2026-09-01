import { ACCESS_TOKEN_DURATION } from '@/src/shared/constants/auth/auth.constants';

export const HIDE_PASSWORD_OPTIONS = [
    { value: 3000, label: '3 segundos' },
    { value: 5000, label: '5 segundos (recomendado)' },
    { value: 10000, label: '10 segundos' },
    { value: 30000, label: '30 segundos' },
    { value: -1, label: 'Nunca' },
];

export const SESSION_TIMEOUT_OPTIONS = [
    { value: ACCESS_TOKEN_DURATION.MINUTES_30, label: '30 minutos' },
    { value: ACCESS_TOKEN_DURATION.HOUR_1, label: '1 hora' },
    { value: ACCESS_TOKEN_DURATION.HOURS_2, label: '2 horas' },
];
