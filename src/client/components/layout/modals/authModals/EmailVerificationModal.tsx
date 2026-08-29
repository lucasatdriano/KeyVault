'use client';

import React from 'react';
import { MailIcon, RefreshCwIcon, AlertCircleIcon } from 'lucide-react';

import Button from '@/src/client/components/ui/buttons/Button';
import ModalBase from '@/src/client/components/layout/modals/ModalBase';

interface EmailVerificationModalProps {
    isOpen: boolean;
    email: string;
    onVerify: () => void;
    onResendEmail: () => Promise<void>;
}

export default function EmailVerificationModal({
    isOpen,
    email,
    onVerify,
    onResendEmail,
}: EmailVerificationModalProps) {
    const [isResending, setIsResending] = React.useState(false);

    const handleResendEmail = async () => {
        setIsResending(true);

        try {
            await onResendEmail();
        } finally {
            setIsResending(false);
        }
    };

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={() => {}}
            title="Verifique seu e-mail"
            icon={<MailIcon className="w-5 h-5 text-primary" />}
            maxWidth="md"
            canClose={false}
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
                        Clique no botão abaixo para continuar com a verificação
                        do seu e-mail.
                    </p>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertCircleIcon className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />

                        <div className="text-sm text-yellow-500/80">
                            <p>
                                Não recebeu o e-mail? Você pode solicitar um
                                novo envio.
                            </p>

                            <p className="mt-1">
                                Verifique também sua caixa de spam.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <div className="flex items-start gap-3">
                            <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                            <div className="text-sm text-foreground/70">
                                <p>
                                    <span className="font-medium text-foreground">
                                        O envio de e-mails está temporariamente
                                        indisponível.
                                    </span>
                                </p>

                                <p className="mt-1">
                                    Para continuar, clique em{' '}
                                    <span className="font-medium text-primary">
                                        Verificar e-mail
                                    </span>{' '}
                                    e confirme seu endereço diretamente no
                                    aplicativo.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button type="button" onClick={onVerify} fullWidth>
                        Verificar e-mail
                    </Button>

                    <Button
                        type="button"
                        onClick={handleResendEmail}
                        disabled={true}
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
