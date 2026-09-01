'use client';

import { ShieldCheckIcon } from 'lucide-react';

import { recoveryMethodConfig } from '@/src/app/(protected)/account/recovery/components/recovery-method.config';

interface RecoveryLevelCardProps {
    level: {
        label: string;
        color: string;
        background: string;
    };
    activeMethodsCount: number;
    totalMethods?: number;
}

export default function RecoveryLevelCard({
    level,
    activeMethodsCount,
    totalMethods = Object.keys(recoveryMethodConfig).length,
}: RecoveryLevelCardProps) {
    return (
        <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${level.background}`}
                >
                    <ShieldCheckIcon className={`h-6 w-6 ${level.color}`} />
                </div>

                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/40">
                        Nível de Recuperação
                    </h2>

                    <p className={`text-2xl font-bold ${level.color}`}>
                        {level.label}
                    </p>
                </div>
            </div>

            <div className="text-right">
                <p className="text-xs text-foreground/40">
                    {activeMethodsCount} de {totalMethods} métodos ativos
                </p>
            </div>
        </div>
    );
}
