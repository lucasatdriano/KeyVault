'use client';

import React from 'react';
import { MailIcon, RefreshCwIcon, AlertCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

import Button from '@/src/client/components/ui/buttons/Button';
import ModalBase from '../ModalBase';

interface EmailVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    onResendEmail: () => Promise<void>;
}

export default function EmailVerificationModal({
    isOpen,
    onClose,
    email,
    onResendEmail,
}: EmailVerificationModalProps) {
    const [isResending, setIsResending] = React.useState(false);

    const handleResendEmail = async () => {
        setIsResending(true);
        try {
            await onResendEmail();
            toast.success('E-mail reenviado com sucesso!');
        } catch {
            toast.error('Erro ao reenviar e-mail.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title="Verifique seu e-mail"
            icon={<MailIcon className="w-5 h-5 text-primary" />}
            maxWidth="md"
        >
            <div className="space-y-6">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <MailIcon className="w-8 h-8 text-primary" />
                    </div>

                    <p className="text-foreground/80 text-sm leading-relaxed">
                        Enviamos um e-mail de verificação para{' '}
                        <span className="text-foreground font-semibold">
                            {email}
                        </span>
                    </p>

                    <p className="text-foreground/60 text-sm mt-2">
                        Clique no link enviado para ativar sua conta.
                    </p>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertCircleIcon className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-500/80">
                            <p>
                                Não recebeu o e-mail? Clique no botão abaixo
                                para reenviar.
                            </p>
                            <p className="mt-1">
                                Verifique se o e-mail digitado está correto ou
                                confira sua caixa de spam.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        type="button"
                        onClick={handleResendEmail}
                        disabled={isResending}
                        fullWidth
                        isLoading={isResending}
                        loadingText="Reenviando..."
                        leftIcon={
                            !isResending ? (
                                <RefreshCwIcon className="w-4 h-4" />
                            ) : undefined
                        }
                        variant="secondary"
                    >
                        Reenviar e-mail
                    </Button>
                </div>
            </div>
        </ModalBase>
    );
}
