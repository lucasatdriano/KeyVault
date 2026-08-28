/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    AlertCircleIcon,
    CheckCircle2Icon,
    KeyIcon,
    LockKeyholeIcon,
    ShieldIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { verifyQuestionsChallengeAction } from '@/src/server/actions/recovery/flow/verify-questions-challenge.action';
import { getCurrentRecoveryChallengeAction } from '@/src/server/actions/recovery/flow/get-current-recovery-challenge.action';
import { getRecoveryQuestionsChallengeAction } from '@/src/server/actions/recovery/flow/get-recovery-questions-challenge.action';
import { verifyRecoveryPasswordChallengeAction } from '@/src/server/actions/recovery/flow/verify-recovery-password-challenge.action';
import { verifyRecoveryKeyChallengeAction } from '@/src/server/actions/recovery/flow/verify-recovery-key-challenge.action';

import { RecoveryType } from '@/src/shared/types/recovery';

import {
    RecoveryChallenge,
    RecoveryQuestion,
} from '@/src/client/types/recovery';

import Button from '@/src/client/components/ui/buttons/Button';
import Logo from '@/src/client/components/layout/logo/Logo';
import RecoveryPasswordValidationModal from '@/src/client/components/layout/modals/recoveryModals/RecoveryPasswordValidationModal';
import RecoveryKeyValidationModal from '@/src/client/components/layout/modals/recoveryModals/RecoveryKeyValidationModal';
import QuizAnswerModal from '@/src/client/components/layout/modals/recoveryModals/AswerQuestionsRecoveryModal';

export default function RecoveryFlowClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [challenge, setChallenge] = useState<RecoveryChallenge | null>(null);
    const [questions, setQuestions] = useState<RecoveryQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleInvalidRecovery = useCallback(
        (message?: string) => {
            if (message) {
                toast.error(message);
            }

            router.replace('/forgot-password');
        },
        [router],
    );

    const loadQuestions = useCallback(async (recoveryToken: string) => {
        const result = await getRecoveryQuestionsChallengeAction(recoveryToken);

        if (!result.success || !result.data) {
            throw new Error(
                result.error ??
                    'Não foi possível carregar as perguntas de recuperação.',
            );
        }

        setQuestions(result.data.questions);
    }, []);

    const loadCurrentChallenge = useCallback(async () => {
        if (!token) {
            handleInvalidRecovery('Token de recuperação não encontrado.');

            return;
        }

        setIsLoading(true);

        try {
            const result = await getCurrentRecoveryChallengeAction(token);

            if (!result.success || !result.data) {
                throw new Error(
                    result.error ?? 'Não foi possível continuar a recuperação.',
                );
            }

            setChallenge(result.data);

            if (result.data.type === RecoveryType.QUESTIONS) {
                await loadQuestions(token);
            } else {
                setQuestions([]);
            }
        } catch (error) {
            handleInvalidRecovery(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível continuar a recuperação.',
            );
        } finally {
            setIsLoading(false);
        }
    }, [handleInvalidRecovery, loadQuestions, token]);

    useEffect(() => {
        loadCurrentChallenge();
    }, [loadCurrentChallenge]);

    const handleChallengeCompleted = async (result: {
        completed: boolean;
        nextMethod: RecoveryType | null;
    }) => {
        if (result.completed) {
            toast.success('Sua identidade foi verificada com sucesso.');

            router.replace(
                `/forgot-password/reset-password?token=${encodeURIComponent(
                    token!,
                )}`,
            );

            return;
        }

        toast.success('Método de recuperação verificado.');

        await loadCurrentChallenge();
    };

    const handleVerifyQuestions = async (answers: string[]) => {
        if (!token) {
            return;
        }

        setIsVerifying(true);

        try {
            const result = await verifyQuestionsChallengeAction(token, answers);

            if (!result.success || !result.data) {
                throw new Error(
                    result.error ?? 'Não foi possível verificar as respostas.',
                );
            }

            await handleChallengeCompleted(result.data);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível verificar as respostas.',
            );

            await loadCurrentChallenge();
        } finally {
            setIsVerifying(false);
        }
    };

    const handleVerifyRecoveryPassword = async (recoveryPassword: string) => {
        if (!token) {
            return;
        }

        setIsVerifying(true);

        try {
            const result = await verifyRecoveryPasswordChallengeAction(
                token,
                recoveryPassword,
            );

            if (!result.success || !result.data) {
                throw new Error(
                    result.error ?? 'Não foi possível verificar a senha.',
                );
            }

            await handleChallengeCompleted(result.data);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível verificar a senha.',
            );

            await loadCurrentChallenge();
        } finally {
            setIsVerifying(false);
        }
    };

    const handleVerifyRecoveryKey = async (recoveryKey: string) => {
        if (!token) {
            return;
        }

        setIsVerifying(true);

        try {
            const result = await verifyRecoveryKeyChallengeAction(
                token,
                recoveryKey,
            );

            if (!result.success || !result.data) {
                throw new Error(
                    result.error ?? 'Não foi possível verificar a chave.',
                );
            }

            await handleChallengeCompleted(result.data);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível verificar a chave.',
            );

            await loadCurrentChallenge();
        } finally {
            setIsVerifying(false);
        }
    };

    const handleCancel = () => {
        if (isVerifying) {
            return;
        }

        router.replace('/forgot-password');
    };

    if (isLoading || !challenge) {
        return (
            <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col items-center justify-center py-12">
                    <Logo variant="icon" size="lg" />

                    <p className="mt-6 text-sm text-foreground/60">
                        Carregando recuperação...
                    </p>
                </div>
            </div>
        );
    }

    const currentMethodLabel = {
        [RecoveryType.EMAIL]: 'Verificação por e-mail',
        [RecoveryType.QUESTIONS]: 'Perguntas de segurança',
        [RecoveryType.RECOVERY_PASSWORD]: 'Senha de recuperação',
        [RecoveryType.RECOVERY_KEY]: 'Chave de recuperação',
    }[challenge.type];

    const CurrentIcon = {
        [RecoveryType.EMAIL]: ShieldIcon,
        [RecoveryType.QUESTIONS]: ShieldIcon,
        [RecoveryType.RECOVERY_PASSWORD]: LockKeyholeIcon,
        [RecoveryType.RECOVERY_KEY]: KeyIcon,
    }[challenge.type];

    const currentStep = challenge.completedSteps + 1;

    return (
        <>
            <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-6 flex justify-center">
                    <Logo variant="icon" size="lg" />
                </div>

                <div className="text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <CurrentIcon className="h-8 w-8 text-primary" />
                    </div>

                    <h1 className="text-2xl font-bold text-foreground">
                        Recuperação de conta
                    </h1>

                    <p className="mt-2 text-sm text-foreground/60">
                        Complete todos os métodos de recuperação configurados
                        para continuar.
                    </p>
                </div>

                <div className="mt-8">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm text-foreground/60">
                            Etapa {currentStep} de {challenge.totalSteps}
                        </span>

                        <span className="text-sm font-medium text-primary">
                            {currentMethodLabel}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {Array.from({
                            length: challenge.totalSteps,
                        }).map((_, index) => {
                            const isCompleted =
                                index < challenge.completedSteps;

                            const isCurrent = index === challenge.currentStep;

                            return (
                                <div
                                    key={index}
                                    className={`flex h-2 flex-1 items-center justify-center rounded-full transition-all ${
                                        isCompleted
                                            ? 'bg-green-500'
                                            : isCurrent
                                              ? 'bg-primary'
                                              : 'bg-white/10'
                                    }`}
                                >
                                    {isCompleted && (
                                        <CheckCircle2Icon className="h-3 w-3 text-white" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-start gap-3">
                        <AlertCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                        <div>
                            <p className="font-medium text-foreground">
                                Próxima verificação
                            </p>

                            <p className="mt-1 text-sm text-foreground/60">
                                Complete a etapa atual para continuar a
                                recuperação da sua conta.
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={handleCancel}
                    variant="secondary"
                    fullWidth
                    className="mt-6"
                    disabled={isVerifying}
                >
                    Cancelar recuperação
                </Button>
            </div>

            <QuizAnswerModal
                isOpen={challenge.type === RecoveryType.QUESTIONS}
                onClose={handleCancel}
                onVerify={handleVerifyQuestions}
                questions={questions}
                isLoading={isVerifying}
            />

            <RecoveryPasswordValidationModal
                isOpen={challenge.type === RecoveryType.RECOVERY_PASSWORD}
                onClose={handleCancel}
                onVerify={handleVerifyRecoveryPassword}
                isLoading={isVerifying}
            />

            <RecoveryKeyValidationModal
                isOpen={challenge.type === RecoveryType.RECOVERY_KEY}
                onClose={handleCancel}
                onVerify={handleVerifyRecoveryKey}
                isLoading={isVerifying}
            />
        </>
    );
}
