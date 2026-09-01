'use client';

import { AlertTriangleIcon, Trash2Icon, ChevronRightIcon } from 'lucide-react';

interface DangerZoneCardProps {
    onDeleteClick: () => void;
}

export default function DangerZoneCard({ onDeleteClick }: DangerZoneCardProps) {
    return (
        <div className="bg-error/5 border border-error/20 rounded-2xl p-6 mx-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
                <AlertTriangleIcon className="w-5 h-5 text-error" />
                <h2 className="text-sm font-semibold text-error uppercase tracking-wider">
                    Zona de Perigo
                </h2>
            </div>

            <p className="text-xs text-foreground/40 mb-4">
                Ações irreversíveis. Proceda com cuidado.
            </p>

            <div className="flex items-center justify-between p-3 rounded-xl bg-error/5 border border-error/10 hover:bg-error/10 transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                        <Trash2Icon className="w-5 h-5 text-error" />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-error">
                            Excluir conta
                        </p>
                        <p className="text-xs text-foreground/40">
                            Todos os dados serão permanentemente deletados
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onDeleteClick}
                    className="cursor-pointer text-sm text-error font-medium hover:underline flex items-center gap-1"
                >
                    Excluir
                    <ChevronRightIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
