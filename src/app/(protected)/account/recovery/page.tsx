/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    AlertTriangleIcon,
    CheckCircleIcon,
    HelpCircleIcon,
    ShieldCheckIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { getRecoveryMethodsAction } from '@/src/server/actions/recovery/get-recovery-methods.action';
import { enableRecoveryMethodAction } from '@/src/server/actions/recovery/enable-recovery-method.action';
import { disableRecoveryMethodAction } from '@/src/server/actions/recovery/disable-recovery-method.action';
import { configureRecoveryQuestionsAction } from '@/src/server/actions/recovery/configure-recovery-questions.action';
import { generateRecoveryKeyAction } from '@/src/server/actions/recovery/generate-recovery-key.action';

import { encryptString } from '@/src/shared/crypto/cipher';

import { useVaultStore } from '@/src/client/store/vault.store';
import { recoveryMethodConfig } from './components/recovery-method.config';

import Header from '@/src/client/components/layout/header/Header';
import InfoCard from '@/src/client/components/ui/cards/InfoCard';

import QuizFormModal from '@/src/client/components/layout/modals/recoveryModals/CreateQuestionsRecoveryModal';
import RecoveryKeyModal from '@/src/client/components/layout/modals/recoveryModals/RecoveryKeyModal';

import RecoveryMethodCard from './components/RecoveryMethodCard';
import { RecoveryType } from '@/src/shared/types/recovery';

interface RecoveryMethod {
    id: string;
    type: RecoveryType;
    enabled: boolean;
    secretHash?: string | null;
}

interface QuizQuestion {
    id?: string;
    question: string;
    answer: string;
}

export default function RecoveryPage() {
    const [methods, setMethods] = useState<RecoveryMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showRecoveryKeyModal, setShowRecoveryKeyModal] = useState(false);

    const [showQuestionsModal, setShowQuestionsModal] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const vaultKey = useVaultStore((state) => state.vaultKey);

    const loadMethods = useCallback(async () => {
        try {
            setIsLoading(true);

            const result = await getRecoveryMethodsAction();

            if (!result.success || !result.data) {
                toast.error(
                    result.error ?? 'Erro ao carregar métodos de recuperação.',
                );

                return;
            }

            setMethods(result.data);
        } catch {
            toast.error('Erro ao carregar métodos de recuperação.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMethods();
    }, [loadMethods]);

    const activeMethods = useMemo(
        () => methods.filter((method) => method.enabled),
        [methods],
    );

    const recoveryLevel =
        activeMethods.length >= 2
            ? 'Alto'
            : activeMethods.length >= 1
              ? 'Médio'
              : 'Baixo';

    const recoveryLevelColor =
        activeMethods.length >= 2
            ? 'text-green-500'
            : activeMethods.length >= 1
              ? 'text-yellow-500'
              : 'text-error';

    const recoveryLevelBg =
        activeMethods.length >= 2
            ? 'bg-green-500/10'
            : activeMethods.length >= 1
              ? 'bg-yellow-500/10'
              : 'bg-error/10';

    const getMethod = (type: RecoveryType) =>
        methods.find((method) => method.type === type);

    const recoveryKeyMethod = getMethod(RecoveryType.RECOVERY_KEY);

    const hasRecoveryKey = Boolean(
        recoveryKeyMethod?.enabled && recoveryKeyMethod?.secretHash,
    );

    const handleEnableMethod = async (type: RecoveryType) => {
        if (type === RecoveryType.QUESTIONS) {
            setShowQuestionsModal(true);

            return;
        }

        if (type === RecoveryType.RECOVERY_KEY) {
            setShowRecoveryKeyModal(true);

            return;
        }

        try {
            setIsSubmitting(true);

            const result = await enableRecoveryMethodAction(type);

            if (!result.success) {
                toast.error(result.error ?? 'Erro ao ativar método.');

                return;
            }

            toast.success('Método de recuperação ativado com sucesso.');

            await loadMethods();
        } catch {
            toast.error('Erro ao ativar método de recuperação.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDisableMethod = async (type: RecoveryType) => {
        try {
            setIsSubmitting(true);

            const result = await disableRecoveryMethodAction(type);

            if (!result.success) {
                toast.error(result.error ?? 'Erro ao desativar método.');

                return;
            }

            toast.success('Método de recuperação desativado.');

            await loadMethods();
        } catch {
            toast.error('Erro ao desativar método de recuperação.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfigureQuestions = async (questions: QuizQuestion[]) => {
        if (!vaultKey) {
            toast.error('Não foi possível acessar a chave do cofre.');

            return;
        }

        try {
            setIsSubmitting(true);

            const encryptedQuestions = await Promise.all(
                questions.map(async (question) => {
                    const encrypted = await encryptString(
                        question.question,
                        vaultKey,
                    );

                    return {
                        questionCipherText: encrypted.cipherText,
                        questionIv: encrypted.iv,
                        answer: question.answer.trim().toLowerCase(),
                    };
                }),
            );

            const result =
                await configureRecoveryQuestionsAction(encryptedQuestions);

            if (!result.success) {
                toast.error(result.error ?? 'Erro ao configurar perguntas.');

                return;
            }

            toast.success('Perguntas de segurança configuradas com sucesso.');

            setShowQuestionsModal(false);

            await loadMethods();
        } catch {
            toast.error('Erro ao configurar perguntas de segurança.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGenerateRecoveryKey = async (): Promise<string> => {
        const result = await generateRecoveryKeyAction();

        if (!result.success || !result.data) {
            throw new Error(
                result.error ?? 'Erro ao gerar chave de recuperação.',
            );
        }

        return result.data;
    };

    const handleConfigureMethod = (type: RecoveryType) => {
        if (type === RecoveryType.QUESTIONS) {
            setShowQuestionsModal(true);

            return;
        }

        if (type === RecoveryType.RECOVERY_KEY) {
            setShowRecoveryKeyModal(true);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Header variant="recovery" />

                <div className="mx-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="text-sm text-foreground/40">
                        Carregando métodos de recuperação...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <Header variant="recovery" />

                <div className="mx-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl ${recoveryLevelBg}`}
                            >
                                <ShieldCheckIcon
                                    className={`h-6 w-6 ${recoveryLevelColor}`}
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/40">
                                    Nível de Recuperação
                                </h2>

                                <p
                                    className={`text-2xl font-bold ${recoveryLevelColor}`}
                                >
                                    {recoveryLevel}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-xs text-foreground/40">
                                {activeMethods.length} de{' '}
                                {Object.keys(recoveryMethodConfig).length}{' '}
                                métodos ativos
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                        <div className="flex items-start gap-3">
                            {activeMethods.length >= 2 ? (
                                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                            ) : (
                                <AlertTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
                            )}

                            <div>
                                <p className="text-sm text-foreground/60">
                                    {activeMethods.length >= 2
                                        ? 'Bom! Adicione mais um método para aumentar a segurança da recuperação.'
                                        : 'Adicione mais métodos de recuperação para aumentar a segurança da sua conta.'}
                                </p>

                                <p className="mt-1 text-xs text-foreground/30">
                                    Recomendamos ativar ao menos 2 métodos
                                    independentes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-4 space-y-4">
                    {Object.values(recoveryMethodConfig).map((config) => {
                        const method = getMethod(config.type);

                        const isActive = method?.enabled ?? false;

                        return (
                            <RecoveryMethodCard
                                key={config.type}
                                config={config}
                                isActive={isActive}
                                isSubmitting={isSubmitting}
                                onEnable={() => handleEnableMethod(config.type)}
                                onDisable={() =>
                                    handleDisableMethod(config.type)
                                }
                                onConfigure={
                                    config.type !== RecoveryType.EMAIL
                                        ? () =>
                                              handleConfigureMethod(config.type)
                                        : undefined
                                }
                            />
                        );
                    })}
                </div>

                <InfoCard
                    icon={HelpCircleIcon}
                    title="Como funciona a recuperação?"
                    variant="primary"
                >
                    <>
                        Se você esquecer sua senha mestre, os métodos ativos
                        acima permitirão verificar sua identidade e criar uma
                        nova senha.{' '}
                        <span className="text-foreground/40">
                            Recomendamos ativar ao menos 2 métodos
                            independentes.
                        </span>
                    </>
                </InfoCard>
            </div>

            <RecoveryKeyModal
                isOpen={showRecoveryKeyModal}
                onClose={(shouldReload) => {
                    setShowRecoveryKeyModal(false);
                    if (shouldReload) {
                        loadMethods();
                    }
                }}
                hasRecoveryKey={hasRecoveryKey}
                onGenerate={handleGenerateRecoveryKey}
            />

            <QuizFormModal
                isOpen={showQuestionsModal}
                onClose={() => setShowQuestionsModal(false)}
                onSave={handleConfigureQuestions}
                maxQuestions={3}
                isLoading={isSubmitting}
            />
        </>
    );
}
