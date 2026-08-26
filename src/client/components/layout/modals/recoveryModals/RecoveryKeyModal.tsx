'use client';

import { useState } from 'react';
import {
    KeyIcon,
    CopyIcon,
    CheckIcon,
    ShieldIcon,
    AlertCircleIcon,
    RefreshCwIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import Button from '@/src/client/components/ui/buttons/Button';
import ModalBase from '../ModalBase';

interface RecoveryKeyModalProps {
    isOpen: boolean;
    onClose: (shouldReload?: boolean) => void;
    onGenerate: () => Promise<string>;
    hasRecoveryKey: boolean;
    title?: string;
}

export default function RecoveryKeyModal({
    isOpen,
    onClose,
    onGenerate,
    hasRecoveryKey,
    title = 'Chave de recuperação',
}: RecoveryKeyModalProps) {
    const [recoveryKey, setRecoveryKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [justGenerated, setJustGenerated] = useState(false);

    const handleClose = () => {
        const wasGenerated = justGenerated;

        setRecoveryKey('');
        setIsCopied(false);
        setJustGenerated(false);

        onClose(wasGenerated);
    };

    const handleGenerate = async () => {
        setIsLoading(true);

        try {
            const key = await onGenerate();

            setRecoveryKey(key);
            setJustGenerated(true);

            toast.success(
                hasRecoveryKey
                    ? 'Chave de recuperação regenerada com sucesso!'
                    : 'Chave de recuperação gerada com sucesso!',
            );
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Erro ao gerar chave de recuperação.',
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!recoveryKey) {
            return;
        }

        try {
            await navigator.clipboard.writeText(recoveryKey);

            setIsCopied(true);

            toast.success('Chave copiada para a área de transferência!');

            setTimeout(() => {
                setIsCopied(false);
            }, 3000);
        } catch {
            toast.error('Erro ao copiar chave.');
        }
    };

    const showKeyView = justGenerated && Boolean(recoveryKey);

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            icon={<KeyIcon className="h-5 w-5 text-primary" />}
            maxWidth="md"
            canClose={!isLoading}
        >
            <div className="space-y-6">
                {showKeyView && (
                    <div className="space-y-6 py-6">
                        <div className="text-center">
                            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                                <CheckIcon className="h-10 w-10 text-green-500" />
                            </div>

                            <h3 className="text-xl font-semibold text-foreground">
                                Chave de recuperação gerada!
                            </h3>

                            <p className="mt-2 text-sm text-foreground/50">
                                Guarde esta chave antes de fechar esta janela.
                            </p>
                        </div>

                        <div className="flex  items-center justify-center rounded-2xl border border-primary/30 bg-primary/5 px-6 py-10">
                            <span className="break-all text-center font-mono text-2xl font-bold text-primary">
                                {recoveryKey}
                            </span>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                type="button"
                                onClick={handleCopy}
                                variant="secondary"
                                leftIcon={
                                    isCopied ? (
                                        <CheckIcon className="h-4 w-4" />
                                    ) : (
                                        <CopyIcon className="h-4 w-4" />
                                    )
                                }
                            >
                                {isCopied ? 'Chave copiada!' : 'Copiar chave'}
                            </Button>
                        </div>

                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                                <div className="text-sm text-red-500/80">
                                    <p className="font-medium text-red-500">
                                        Atenção!
                                    </p>

                                    <p className="mt-1">
                                        Esta chave será exibida apenas agora.
                                        Depois que esta janela for fechada, não
                                        será possível visualizá-la novamente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!showKeyView && hasRecoveryKey && !isLoading && (
                    <div className="space-y-4 py-4">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                                <CheckIcon className="h-10 w-10 text-green-500" />
                            </div>

                            <p className="font-medium text-foreground">
                                Você já possui uma chave de recuperação
                            </p>

                            <div className="mt-3 flex items-center justify-center gap-2">
                                <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2">
                                    <span className="font-mono text-sm text-foreground/60 tracking-wider">
                                        KV-******-******-******
                                    </span>
                                </div>
                                <span className="text-xs text-foreground/30">
                                    (chave atual)
                                </span>
                            </div>

                            <p className="mt-4 text-sm text-foreground/40">
                                Por segurança, sua chave completa não pode ser
                                visualizada novamente.
                            </p>
                        </div>

                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                                <p className="text-sm text-red-500/80">
                                    Ao gerar uma nova chave, a chave anterior
                                    será invalidada imediatamente.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {!showKeyView && !hasRecoveryKey && !isLoading && (
                    <>
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                            <div className="flex items-start gap-3">
                                <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

                                <div className="text-sm text-amber-500/80">
                                    <p className="font-medium text-amber-500">
                                        Guarde sua chave em um local seguro!
                                    </p>

                                    <p className="mt-1">
                                        A chave de recuperação pode ser
                                        utilizada para recuperar sua conta caso
                                        você perca o acesso.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="py-8 text-center">
                            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                                <KeyIcon className="h-12 w-12 text-primary" />
                            </div>

                            <p className="text-lg font-medium text-foreground">
                                Você ainda não possui uma chave
                            </p>

                            <p className="mt-2 text-sm text-foreground/40">
                                Gere uma chave de recuperação e guarde-a em um
                                local seguro.
                            </p>
                        </div>
                    </>
                )}

                <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                    {showKeyView ? (
                        <Button
                            type="button"
                            onClick={handleClose}
                            variant="secondary"
                        >
                            Fechar
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="button"
                                onClick={handleClose}
                                variant="secondary"
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="button"
                                onClick={handleGenerate}
                                isLoading={isLoading}
                                loadingText={
                                    hasRecoveryKey
                                        ? 'Gerando nova chave...'
                                        : 'Gerando chave...'
                                }
                                leftIcon={
                                    hasRecoveryKey ? (
                                        <RefreshCwIcon className="h-4 w-4" />
                                    ) : (
                                        <KeyIcon className="h-4 w-4" />
                                    )
                                }
                            >
                                {hasRecoveryKey
                                    ? 'Gerar nova chave'
                                    : 'Gerar chave'}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </ModalBase>
    );
}
