'use client';

import {
    AlertTriangleIcon,
    ShieldCheckIcon,
    Trash2Icon,
    ClockIcon,
} from 'lucide-react';

import Button from '@/src/client/components/ui/buttons/Button';
import ModalBase from '@/src/client/components/layout/modals/ModalBase';

interface DeleteCredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    credentialTitle: string;
    isLoading?: boolean;
}

export default function DeleteCredentialModal({
    isOpen,
    onClose,
    onConfirm,
    credentialTitle,
    isLoading = false,
}: DeleteCredentialModalProps) {
    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title="Excluir credencial"
            maxWidth="md"
            icon={<AlertTriangleIcon className="h-5 w-5 text-error" />}
            footer={
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                        fullWidth
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="error"
                        onClick={onConfirm}
                        isLoading={isLoading}
                        loadingText="Excluindo..."
                        leftIcon={<Trash2Icon className="h-5 w-5" />}
                        fullWidth
                    >
                        Excluir
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-error/20 bg-error/10">
                        <AlertTriangleIcon className="h-8 w-8 text-error" />
                    </div>
                </div>

                <div className="space-y-2 text-center">
                    <p className="text-foreground/70">
                        Você está prestes a excluir a credencial{' '}
                        <span className="font-semibold text-foreground">
                            {credentialTitle}
                        </span>
                        .
                    </p>

                    <p className="text-sm text-foreground/50">
                        Ela será movida para a lixeira e poderá ser restaurada
                        durante os próximos 30 dias.
                    </p>
                </div>

                <div className="rounded-2xl border border-error/20 bg-error/10 p-4">
                    <div className="flex items-start gap-3">
                        <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-error" />

                        <div>
                            <p className="text-sm font-medium text-error">
                                A exclusão não é imediata
                            </p>

                            <p className="mt-1 text-xs text-error/70">
                                A credencial ficará disponível na lixeira por
                                até 30 dias antes de ser removida
                                permanentemente.
                            </p>

                            <p className="mt-2 flex items-center gap-1 text-xs text-error/70">
                                <ClockIcon className="h-3 w-3" />
                                Você pode restaurá-la a qualquer momento nesse
                                período.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ModalBase>
    );
}
