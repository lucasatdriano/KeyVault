'use client';

import React from 'react';
import {
    AlertTriangle,
    X,
    ShieldCheckIcon,
    Trash2,
    Clock,
    AlertCircle,
} from 'lucide-react';
import Button from '@/src/client/components/ui/buttons/Button';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    credentialTitle: string;
    isPermanent?: boolean;
    daysRemaining?: number;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    credentialTitle,
    isPermanent = false,
    daysRemaining,
}) => {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="relative w-full max-w-md bg-background/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-white/5 text-foreground/40 hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex justify-center mb-4">
                        <div
                            className={`
                            w-16 h-16 rounded-full flex items-center justify-center border-2
                            ${
                                isPermanent
                                    ? 'bg-error/10 border-error/20'
                                    : 'bg-yellow-500/10 border-yellow-500/20'
                            }
                        `}
                        >
                            {isPermanent ? (
                                <AlertTriangle className="w-8 h-8 text-error" />
                            ) : (
                                <AlertCircle className="w-8 h-8 text-yellow-500" />
                            )}
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-foreground text-center mb-2">
                        {isPermanent
                            ? 'Excluir permanentemente?'
                            : 'Excluir esta credencial?'}
                    </h2>

                    <p className="text-foreground/60 text-sm text-center mb-6">
                        {isPermanent ? (
                            <>
                                Você está prestes a excluir permanentemente a
                                credencial{' '}
                                <span className="text-foreground font-medium">
                                    {credentialTitle}
                                </span>
                                . Esta ação é{' '}
                                <span className="text-error font-medium">
                                    irreversível
                                </span>
                                .
                            </>
                        ) : (
                            <>
                                Você está prestes a excluir a credencial{' '}
                                <span className="text-foreground font-medium">
                                    {credentialTitle}
                                </span>
                                . Ela será movida para a lixeira e poderá ser
                                restaurada em até 30 dias.
                            </>
                        )}
                    </p>

                    <div
                        className={`
                        rounded-xl p-4 mb-6 border
                        ${
                            isPermanent
                                ? 'bg-error/10 border-error/20'
                                : 'bg-yellow-500/10 border-yellow-500/20'
                        }
                    `}
                    >
                        {isPermanent ? (
                            <div className="flex items-start gap-3">
                                <Trash2 className="w-5 h-5 text-error shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-error/80 font-medium">
                                        Exclusão permanente
                                    </p>
                                    <p className="text-xs text-error/60 mt-0.5">
                                        A credencial será removida
                                        definitivamente e não poderá ser
                                        recuperada.
                                    </p>
                                    {daysRemaining !== undefined &&
                                        daysRemaining > 0 && (
                                            <p className="text-xs text-error/60 mt-1 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Esta credencial expiraria em{' '}
                                                {daysRemaining} dias
                                            </p>
                                        )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-3">
                                <ShieldCheckIcon className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-yellow-500/80 font-medium">
                                        Movida para a lixeira
                                    </p>
                                    <p className="text-xs text-yellow-500/60 mt-0.5">
                                        A credencial será movida para a lixeira
                                        e poderá ser restaurada em até 30 dias.
                                    </p>
                                    <p className="text-xs text-yellow-500/60 mt-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Você terá 30 dias para restaurar
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={onClose} variant="secondary" fullWidth>
                            Cancelar
                        </Button>
                        <Button
                            onClick={onConfirm}
                            variant={isPermanent ? 'error' : 'warning'}
                            fullWidth
                            leftIcon={
                                isPermanent ? (
                                    <Trash2 className="w-5 h-5" />
                                ) : (
                                    <Trash2 className="w-5 h-5" />
                                )
                            }
                        >
                            {isPermanent
                                ? 'Excluir permanentemente'
                                : 'Excluir'}
                        </Button>
                    </div>

                    {isPermanent && (
                        <p className="text-center text-[10px] text-error/40 mt-3">
                            Esta ação não pode ser desfeita. Todos os dados
                            associados serão perdidos.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default DeleteConfirmationModal;
