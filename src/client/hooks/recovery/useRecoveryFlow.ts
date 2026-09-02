'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export function useRecoveryFlow() {
    const router = useRouter();

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

    const loadQuestions = useCallback(async (token: string) => {
        const result = await getRecoveryQuestionsChallengeAction(token);

        if (!result.success || !result.data) {
            throw new Error(
                result.error ??
                    'Não foi possível carregar as perguntas de recuperação.',
            );
        }

        setQuestions(result.data.questions);
    }, []);

    const loadCurrentChallenge = useCallback(
        async (token: string) => {
            if (!token) {
                handleInvalidRecovery('Token de recuperação não encontrado.');
                return;
            }

            setIsLoading(true);

            try {
                const result = await getCurrentRecoveryChallengeAction(token);

                if (!result.success || !result.data) {
                    throw new Error(
                        result.error ??
                            'Não foi possível continuar a recuperação.',
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
        },
        [handleInvalidRecovery, loadQuestions],
    );

    const handleChallengeCompleted = useCallback(
        async (
            result: { completed: boolean; nextMethod: RecoveryType | null },
            token: string,
        ) => {
            if (result.completed) {
                toast.success('Sua identidade foi verificada com sucesso.');
                router.replace(
                    `/forgot-password/reset-password?token=${encodeURIComponent(
                        token,
                    )}`,
                );
                return;
            }

            toast.success('Método de recuperação verificado.');
            await loadCurrentChallenge(token);
        },
        [router, loadCurrentChallenge],
    );

    const handleVerifyQuestions = useCallback(
        async (token: string, answers: string[]) => {
            if (!token) return;

            setIsVerifying(true);

            try {
                const result = await verifyQuestionsChallengeAction(
                    token,
                    answers,
                );

                if (!result.success || !result.data) {
                    throw new Error(
                        result.error ??
                            'Não foi possível verificar as respostas.',
                    );
                }

                await handleChallengeCompleted(result.data, token);
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : 'Não foi possível verificar as respostas.',
                );
                await loadCurrentChallenge(token);
            } finally {
                setIsVerifying(false);
            }
        },
        [handleChallengeCompleted, loadCurrentChallenge],
    );

    const handleVerifyRecoveryPassword = useCallback(
        async (token: string, recoveryPassword: string) => {
            if (!token) return;

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

                await handleChallengeCompleted(result.data, token);
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : 'Não foi possível verificar a senha.',
                );
                await loadCurrentChallenge(token);
            } finally {
                setIsVerifying(false);
            }
        },
        [handleChallengeCompleted, loadCurrentChallenge],
    );

    const handleVerifyRecoveryKey = useCallback(
        async (token: string, recoveryKey: string) => {
            if (!token) return;

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

                await handleChallengeCompleted(result.data, token);
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : 'Não foi possível verificar a chave.',
                );
                await loadCurrentChallenge(token);
            } finally {
                setIsVerifying(false);
            }
        },
        [handleChallengeCompleted, loadCurrentChallenge],
    );

    const handleCancel = useCallback(() => {
        if (isVerifying) return;
        router.replace('/forgot-password');
    }, [router, isVerifying]);

    return {
        challenge,
        questions,
        isLoading,
        isVerifying,

        loadCurrentChallenge,
        handleVerifyQuestions,
        handleVerifyRecoveryPassword,
        handleVerifyRecoveryKey,
        handleCancel,
    };
}
