'use client';

import { InfoIcon, RefreshCwIcon } from 'lucide-react';

import { formatShortDateTime } from '@/src/client/utils/formatters/date';

interface AboutCardProps {
    lastSync: Date | null;
}

export default function AboutCard({ lastSync }: AboutCardProps) {
    return (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mx-4">
            <div className="flex items-center gap-2 mb-4">
                <InfoIcon className="w-5 h-5 text-foreground/40" />
                <h2 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider">
                    Sobre o KeyVault
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <span className="text-sm text-foreground/60">Versão</span>
                    <span className="text-sm font-medium text-foreground">
                        1.0.0
                    </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <span className="text-sm text-foreground/60">
                        Criptografia
                    </span>
                    <span className="text-sm font-medium text-foreground">
                        AES-256-GCM
                    </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <span className="text-sm text-foreground/60">
                        Derivação de chave
                    </span>
                    <span className="text-sm font-medium text-foreground">
                        Argon2id
                    </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <span className="text-sm text-foreground/60">
                        Última sincronização
                    </span>
                    <span className="text-sm font-medium text-foreground flex items-center gap-1">
                        <RefreshCwIcon className="w-3 h-3 text-green-500" />
                        {formatShortDateTime(lastSync)}
                    </span>
                </div>
            </div>
        </div>
    );
}
