'use client';

import { AlertCircleIcon } from 'lucide-react';

import Button from '@/src/client/components/ui/buttons/Button';

import { RecoveryMethodConfig } from './recovery-method.config';

interface RecoveryMethodCardProps {
    config: RecoveryMethodConfig;
    isActive: boolean;
    isSubmitting?: boolean;
    onEnable: () => void;
    onDisable: () => void;
    onConfigure?: () => void;
}

export default function RecoveryMethodCard({
    config,
    isActive,
    isSubmitting = false,
    onEnable,
    onDisable,
    onConfigure,
}: RecoveryMethodCardProps) {
    const Icon = config.icon;

    const getRiskBadgeColor = (
        riskLevel: RecoveryMethodConfig['riskLevel'],
    ) => {
        const colors: Record<RecoveryMethodConfig['riskLevel'], string> = {
            low: 'bg-green-500/20 text-green-500 border-green-500/30',

            medium: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',

            high: 'bg-error/20 text-error border-error/30',
        };

        return colors[riskLevel];
    };

    return (
        <div
            className={`rounded-2xl border bg-white/5 p-5 transition-all ${
                isActive
                    ? 'border-primary/30 hover:border-primary/50'
                    : 'border-white/10 hover:border-white/20'
            }`}
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <div className="flex flex-1 items-start gap-4">
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                            isActive
                                ? 'bg-primary/10 text-primary'
                                : 'bg-white/5 text-foreground/30'
                        }`}
                    >
                        <Icon className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-base font-semibold text-foreground">
                                {config.name}
                            </h3>

                            <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                                    isActive
                                        ? 'border-green-500/30 bg-green-500/20 text-green-500'
                                        : 'border-white/10 bg-white/5 text-foreground/30'
                                }`}
                            >
                                {isActive ? 'Ativo' : 'Inativo'}
                            </span>

                            <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getRiskBadgeColor(
                                    config.riskLevel,
                                )}`}
                            >
                                {config.risk} risco
                            </span>
                        </div>

                        <p className="mt-1 text-sm text-foreground/60">
                            {config.description}
                        </p>

                        <p className="mt-2 flex items-center gap-1 text-xs text-foreground/30">
                            <AlertCircleIcon className="h-3 w-3" />

                            {config.riskDescription}
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    {isActive ? (
                        <>
                            {onConfigure && (
                                <Button
                                    type="button"
                                    onClick={onConfigure}
                                    disabled={isSubmitting}
                                    variant="secondary"
                                    size="sm"
                                >
                                    Configurar
                                </Button>
                            )}

                            <Button
                                type="button"
                                onClick={onDisable}
                                disabled={isSubmitting}
                                variant="error"
                                size="sm"
                            >
                                Desativar
                            </Button>
                        </>
                    ) : (
                        <Button
                            type="button"
                            onClick={onEnable}
                            disabled={isSubmitting}
                            size="sm"
                        >
                            Ativar
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
