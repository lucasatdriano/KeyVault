'use client';

import { AlertTriangleIcon, Trash2Icon } from 'lucide-react';

import Button from '@/src/client/components/ui/buttons/Button';
import ModalBase from '@/src/client/components/layout/modals/ModalBase';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<boolean>;
    isDeleting?: boolean;
}

export default function DeleteAccountModal({
    isOpen,
    onClose,
    onConfirm,
    isDeleting = false,
}: DeleteAccountModalProps) {
    const handleConfirm = async () => {
        await onConfirm();
    };

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title="Excluir conta?"
            icon={<AlertTriangleIcon className="h-5 w-5 text-error" />}
            maxWidth="md"
            canClose={!isDeleting}
        >
            <div className="space-y-5">
                <div>
                    <p className="text-sm text-foreground/60">
                        Esta ação{' '}
                        <span className="text-error font-medium">
                            não pode ser desfeita
                        </span>
                        . Todos os seus dados serão permanentemente deletados.
                    </p>
                </div>

                <div className="bg-error/10 border border-error/20 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                        <AlertTriangleIcon className="w-4 h-4 text-error shrink-0 mt-0.5" />

                        <p className="text-xs text-error/80">
                            Você perderá acesso a todas as suas credenciais e
                            demais dados da conta. Certifique-se de ter um
                            backup antes de prosseguir.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={onClose}
                        variant="secondary"
                        fullWidth
                        disabled={isDeleting}
                    >
                        Cancelar
                    </Button>

                    <Button
                        onClick={handleConfirm}
                        variant="error"
                        fullWidth
                        disabled={isDeleting}
                        isLoading={isDeleting}
                        loadingText="Excluindo..."
                        leftIcon={
                            !isDeleting ? (
                                <Trash2Icon className="w-5 h-5" />
                            ) : undefined
                        }
                    >
                        {isDeleting ? 'Excluindo...' : 'Excluir conta'}
                    </Button>
                </div>
            </div>
        </ModalBase>
    );
}
