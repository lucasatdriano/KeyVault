'use client';

import { AlertCircleIcon } from 'lucide-react';

import Button from '@/src/client/components/ui/buttons/Button';

import { RecoveryMethodConfig } from '@/src/app/(protected)/account/recovery/components/recovery-method.config';

interface RecoveryMethodCardProps {
    config: RecoveryMethodConfig;
    isActive: boolean;
    isDisabled?: boolean;
    disabledReason?: string;
    isSubmitting?: boolean;
    onEnable: () => void;
    onDisable: () => void;
    onConfigure?: () => void;
}

export default function RecoveryMethodCard({
    config,
    isActive,
    isDisabled = false,
    disabledReason = 'Este método não está disponível no momento.',
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

    const cardState = isDisabled
        ? 'disabled'
        : isActive
          ? 'active'
          : 'inactive';

    const cardStyles = {
        active: 'border-primary/30 hover:border-primary/50 bg-white/5',
        inactive: 'border-white/10 hover:border-white/20 bg-white/5',
        disabled: 'border-white/5 bg-white/5 opacity-60 cursor-not-allowed',
    };

    const iconStyles = {
        active: 'bg-primary/10 text-primary',
        inactive: 'bg-white/5 text-foreground/30',
        disabled: 'bg-white/5 text-foreground/20',
    };

    const statusStyles = {
        active: 'border-green-500/30 bg-green-500/20 text-green-500',
        inactive: 'border-white/10 bg-white/5 text-foreground/30',
        disabled: 'border-white/5 bg-white/5 text-foreground/20',
    };

    const statusText = {
        active: 'Ativo',
        inactive: 'Inativo',
        disabled: 'Indisponível',
    };

    return (
        <div
            className={`rounded-2xl border p-5 transition-all ${cardStyles[cardState]}`}
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <div className="flex flex-1 items-start gap-4">
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconStyles[cardState]}`}
                    >
                        <Icon className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-base font-semibold text-foreground">
                                {config.name}
                            </h3>

                            <span
                                className={`text-xs rounded-full border px-2 py-0.5 font-medium ${statusStyles[cardState]}`}
                            >
                                {statusText[cardState]}
                            </span>

                            <span
                                className={`text-xs rounded-full border px-2 py-0.5 font-medium ${getRiskBadgeColor(
                                    config.riskLevel,
                                )}`}
                            >
                                {config.risk} risco
                            </span>
                        </div>

                        <p className="mt-1 text-sm text-foreground/60">
                            {config.description}
                        </p>

                        {isDisabled && disabledReason ? (
                            <p className="mt-2 flex items-center gap-1 text-xs text-error/70">
                                <AlertCircleIcon className="h-3 w-3" />
                                {disabledReason}
                            </p>
                        ) : (
                            <p className="mt-2 flex items-center gap-1 text-xs text-foreground/30">
                                <AlertCircleIcon className="h-3 w-3" />
                                {config.riskDescription}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    {isDisabled ? (
                        <div className="rounded-lg border border-white/5 bg-white/5 px-4 py-2 text-sm text-foreground/30">
                            Indisponível
                        </div>
                    ) : isActive ? (
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
