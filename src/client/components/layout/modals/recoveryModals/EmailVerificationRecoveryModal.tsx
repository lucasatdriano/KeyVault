/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import {
    MailIcon,
    ShieldCheckIcon,
    AlertCircleIcon,
    CheckIcon,
    RefreshCwIcon,
} from 'lucide-react';

import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import ModalBase from '../ModalBase';

interface EmailVerificationRecoveryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (code: string) => Promise<void> | void;
    onResend?: () => Promise<void> | void;
    email?: string;
    title?: string;
    isLoading?: boolean;
    isResending?: boolean;
}

export default function EmailVerificationRecoveryModal({
    isOpen,
    onClose,
    onVerify,
    onResend,
    email,
    title = 'Verificação por e-mail',
    isLoading = false,
    isResending = false,
}: EmailVerificationRecoveryModalProps) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setCode('');
        setError('');
    }, [isOpen]);

    const handleVerify = async () => {
        const normalizedCode = code.trim();

        if (!normalizedCode) {
            setError('Digite o código de verificação.');

            return;
        }

        if (normalizedCode.length < 6) {
            setError('O código de verificação é inválido.');

            return;
        }

        await onVerify(normalizedCode);
    };

    const handleResend = async () => {
        if (!onResend || isResending || isLoading) {
            return;
        }

        await onResend();
    };

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            icon={<MailIcon className="h-5 w-5 text-primary" />}
            maxWidth="md"
            canClose={!isLoading && !isResending}
        >
            <div className="space-y-6">
                <div className="text-center">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <MailIcon className="h-10 w-10 text-primary" />
                    </div>

                    <h3 className="text-xl font-semibold text-foreground">
                        Verifique seu e-mail
                    </h3>

                    <p className="mt-2 text-sm text-foreground/50">
                        Enviamos um código de verificação para
                    </p>

                    {email && (
                        <p className="mt-1 text-sm font-medium text-foreground">
                            {email}
                        </p>
                    )}
                </div>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                    <div className="flex items-start gap-3">
                        <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />

                        <p className="text-sm text-blue-500/80">
                            Digite o código recebido para continuar a
                            recuperação da sua conta.
                        </p>
                    </div>
                </div>

                <InputTextForm
                    label="Código de verificação"
                    name="verificationCode"
                    type="text"
                    placeholder="000000"
                    value={code}
                    disabled={isLoading || isResending}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');

                        setCode(value);

                        if (error) {
                            setError('');
                        }
                    }}
                    error={error}
                    leftIcon={<MailIcon className="h-5 w-5" />}
                />

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

                        <p className="text-sm text-amber-500/80">
                            O código possui um tempo limitado de validade.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    {onResend ? (
                        <Button
                            type="button"
                            onClick={handleResend}
                            variant="secondary"
                            disabled={isLoading || isResending}
                            isLoading={isResending}
                            loadingText="Enviando..."
                            leftIcon={<RefreshCwIcon className="h-4 w-4" />}
                        >
                            Reenviar código
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="secondary"
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                    )}

                    <Button
                        type="button"
                        onClick={handleVerify}
                        disabled={!code.trim() || isLoading || isResending}
                        isLoading={isLoading}
                        loadingText="Verificando..."
                        leftIcon={<CheckIcon className="h-4 w-4" />}
                    >
                        Verificar
                    </Button>
                </div>
            </div>
        </ModalBase>
    );
}
