/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { getRecoveryMethodsAction } from '@/src/server/actions/recovery/settings/get-recovery-methods.action';
import { enableRecoveryMethodAction } from '@/src/server/actions/recovery/settings/enable-recovery-method.action';
import { disableRecoveryMethodAction } from '@/src/server/actions/recovery/settings/disable-recovery-method.action';
import { configureRecoveryQuestionsAction } from '@/src/server/actions/recovery/settings/configure-recovery-questions.action';
import { configureRecoveryPasswordAction } from '@/src/server/actions/recovery/settings/configure-recovery-password.action';
import { generateRecoveryKeyAction } from '@/src/server/actions/recovery/settings/generate-recovery-key.action';

import { RecoveryDataPayload, RecoveryType } from '@/src/shared/types/recovery';
import { createRecoveryData } from '@/src/shared/crypto/recovery';

import { useVaultStore } from '@/src/client/store/vault.store';
import { useAuth } from '@/src/client/hooks/auth/useAuth';
import { QuizQuestion, RecoveryMethod } from '@/src/client/types/recovery';

export function useRecovery() {
    const { user } = useAuth();
    const [methods, setMethods] = useState<RecoveryMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const vaultKey = useVaultStore((state) => state.vaultKey);
    const userEmail = user?.email;

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

    const getMethod = useCallback(
        (type: RecoveryType) => {
            return methods.find((method) => method.type === type);
        },
        [methods],
    );

    const recoveryKeyMethod = getMethod(RecoveryType.RECOVERY_KEY);

    const hasRecoveryKey = Boolean(
        recoveryKeyMethod?.enabled && recoveryKeyMethod?.secretHash,
    );

    const createRecoveryDataPayload =
        useCallback(async (): Promise<RecoveryDataPayload> => {
            if (!vaultKey) {
                throw new Error('Chave do cofre não encontrada.');
            }

            if (!userEmail) {
                throw new Error('E-mail do usuário não encontrado.');
            }

            return createRecoveryData({
                vaultKey,
                email: userEmail,
            });
        }, [vaultKey, userEmail]);

    const handleEnableMethod = useCallback(
        async (type: RecoveryType) => {
            try {
                setIsSubmitting(true);

                const result = await enableRecoveryMethodAction(type);

                if (!result.success) {
                    toast.error(result.error ?? 'Erro ao ativar método.');

                    return false;
                }

                toast.success('Método de recuperação ativado com sucesso.');

                await loadMethods();

                return true;
            } catch {
                toast.error('Erro ao ativar método de recuperação.');

                return false;
            } finally {
                setIsSubmitting(false);
            }
        },
        [loadMethods],
    );

    const handleDisableMethod = useCallback(
        async (type: RecoveryType) => {
            try {
                setIsSubmitting(true);

                const result = await disableRecoveryMethodAction(type);

                if (!result.success) {
                    toast.error(result.error ?? 'Erro ao desativar método.');

                    return false;
                }

                toast.success('Método de recuperação desativado.');

                await loadMethods();

                return true;
            } catch {
                toast.error('Erro ao desativar método de recuperação.');

                return false;
            } finally {
                setIsSubmitting(false);
            }
        },
        [loadMethods],
    );

    const handleConfigureQuestions = useCallback(
        async (questions: QuizQuestion[]) => {
            try {
                setIsSubmitting(true);

                const recoveryData = await createRecoveryDataPayload();

                const result = await configureRecoveryQuestionsAction(
                    questions.map((question) => ({
                        question: question.question.trim(),
                        answer: question.answer,
                    })),
                    recoveryData,
                );

                if (!result.success) {
                    toast.error(
                        result.error ?? 'Erro ao configurar perguntas.',
                    );

                    return false;
                }

                toast.success(
                    'Perguntas de segurança configuradas com sucesso.',
                );

                await loadMethods();

                return true;
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : 'Erro ao configurar perguntas de segurança.',
                );

                return false;
            } finally {
                setIsSubmitting(false);
            }
        },
        [createRecoveryDataPayload, loadMethods],
    );

    const handleConfigureRecoveryPassword = useCallback(
        async (recoveryPassword: string) => {
            try {
                setIsSubmitting(true);

                const recoveryData = await createRecoveryDataPayload();

                const result = await configureRecoveryPasswordAction(
                    recoveryPassword,
                    recoveryData,
                );

                if (!result.success) {
                    toast.error(
                        result.error ??
                            'Erro ao configurar senha de recuperação.',
                    );

                    return false;
                }

                toast.success('Senha de recuperação configurada com sucesso.');

                await loadMethods();

                return true;
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : 'Erro ao configurar senha de recuperação.',
                );

                return false;
            } finally {
                setIsSubmitting(false);
            }
        },
        [createRecoveryDataPayload, loadMethods],
    );

    const handleGenerateRecoveryKey = useCallback(async (): Promise<string> => {
        const recoveryData = await createRecoveryDataPayload();

        const result = await generateRecoveryKeyAction(recoveryData);

        if (!result.success || !result.data) {
            throw new Error(
                result.error ?? 'Erro ao gerar chave de recuperação.',
            );
        }

        return result.data;
    }, [createRecoveryDataPayload]);

    return {
        methods,
        activeMethods,

        isLoading,
        isSubmitting,

        hasRecoveryKey,

        loadMethods,
        getMethod,

        handleEnableMethod,
        handleDisableMethod,
        handleConfigureQuestions,
        handleConfigureRecoveryPassword,
        handleGenerateRecoveryKey,
    };
}
