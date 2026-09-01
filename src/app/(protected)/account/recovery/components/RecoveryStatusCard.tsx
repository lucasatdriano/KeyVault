'use client';

import { AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';

interface RecoveryStatusCardProps {
    isSecure: boolean;
}

export default function RecoveryStatusCard({
    isSecure,
}: RecoveryStatusCardProps) {
    const getMessage = () => {
        if (isSecure) {
            return 'Bom! Adicione mais um método para aumentar a segurança da recuperação.';
        }
        return 'Adicione mais métodos de recuperação para aumentar a segurança da sua conta.';
    };

    return (
        <div className="rounded-xl border border-white/5 bg-white/5 p-4">
            <div className="flex items-start gap-3">
                {isSecure ? (
                    <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                ) : (
                    <AlertTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
                )}

                <div>
                    <p className="text-sm text-foreground/60">{getMessage()}</p>

                    <p className="mt-1 text-xs text-foreground/30">
                        Recomendamos ativar ao menos 2 métodos independentes.
                    </p>
                </div>
            </div>
        </div>
    );
}
