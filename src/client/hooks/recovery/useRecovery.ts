/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { getRecoveryQuestionsAction } from '@/src/server/actions/recovery/settings/get-recovery-questions.action';
import { getRecoveryMethodsAction } from '@/src/server/actions/recovery/settings/get-recovery-methods.action';
import { configureRecoveryQuestionsAction } from '@/src/server/actions/recovery/settings/configure-recovery-questions.action';
import { configureRecoveryPasswordAction } from '@/src/server/actions/recovery/settings/configure-recovery-password.action';
import { generateRecoveryKeyAction } from '@/src/server/actions/recovery/settings/generate-recovery-key.action';
import { updateRecoveryDataAction } from '@/src/server/actions/recovery/settings/update-recovery-data.action';
import { disableRecoveryMethodAction } from '@/src/server/actions/recovery/settings/disable-recovery-method.action';
import { deleteRecoveryDataAction } from '@/src/server/actions/recovery/settings/delete-recovery-data.action';

import { createRecoveryData } from '@/src/shared/crypto/recovery';
import {
    generateRecoveryKey,
    generateSha256,
} from '@/src/shared/crypto/random';
import { RecoveryDataPayload, RecoveryType } from '@/src/shared/types/recovery';

import { useVaultStore } from '@/src/client/store/vault.store';
import {
    QuizQuestion,
    RecoveryMethod,
    RecoveryQuestion,
} from '@/src/client/types/recovery';
import { verifyQuestionsAction } from '@/src/server/actions/recovery/settings/verify-recovery-question.action';
import { verifyRecoveryKeyAction } from '@/src/server/actions/recovery/settings/verify-recovery-key.action';
import { verifyRecoveryPasswordAction } from '@/src/server/actions/recovery/settings/verify-recovery-password.action';

export function useRecovery() {
    const [methods, setMethods] = useState<RecoveryMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [recoverySecrets, setRecoverySecrets] = useState<
        Partial<Record<RecoveryType, string>>
    >({});

    const vaultKey = useVaultStore((state) => state.vaultKey);

    function buildQuestionsSecret(answers: string[]): string {
        return answers
            .map((answer) => answer.trim().toLowerCase())
            .map((answer) => `${answer.length}:${answer}`)
            .join('|');
    }

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

    const activeNonEmailMethods = useMemo(
        () =>
            activeMethods.filter(
                (method) => method.type !== RecoveryType.EMAIL,
            ),
        [activeMethods],
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

    const setRecoverySecret = useCallback(
        (type: RecoveryType, secret: string) => {
            const normalizedSecret = secret.trim();

            if (!normalizedSecret) {
                throw new Error('Segredo de recuperação inválido.');
            }

            setRecoverySecrets((current) => ({
                ...current,
                [type]: normalizedSecret,
            }));
        },
        [],
    );

    const clearRecoverySecret = useCallback((type: RecoveryType) => {
        setRecoverySecrets((current) => {
            const updated = { ...current };

            delete updated[type];

            return updated;
        });
    }, []);

    const clearRecoverySecrets = useCallback(() => {
        setRecoverySecrets({});
    }, []);

    const getActiveRecoverySecrets = useCallback(
        (
            secretsOverride?: Partial<Record<RecoveryType, string>>,
            methodsOverride?: RecoveryMethod[],
        ): string[] => {
            const currentMethods = methodsOverride ?? activeMethods;
            const currentSecrets = secretsOverride ?? recoverySecrets;

            const secrets: string[] = [];

            for (const method of currentMethods) {
                if (method.type === RecoveryType.EMAIL) {
                    continue;
                }

                const secret = currentSecrets[method.type];

                if (!secret) {
                    throw new Error(
                        `O segredo do método ${method.type} não está disponível.`,
                    );
                }

                secrets.push(secret);
            }

            return secrets;
        },
        [activeMethods, recoverySecrets],
    );

    const getQuestionsForReauth = useCallback(async (): Promise<
        RecoveryQuestion[]
    > => {
        const result = await getRecoveryQuestionsAction();

        if (!result.success || !result.data) {
            throw new Error(
                result.error ??
                    'Não foi possível carregar suas perguntas de recuperação.',
            );
        }

        return result.data;
    }, []);

    const getMissingActiveRecoveryMethods = useCallback(
        (
            secretsOverride?: Partial<Record<RecoveryType, string>>,
            methodsOverride?: RecoveryMethod[],
        ): RecoveryMethod[] => {
            const currentMethods = methodsOverride ?? activeNonEmailMethods;
            const currentSecrets = secretsOverride ?? recoverySecrets;

            return currentMethods.filter(
                (method) => !currentSecrets[method.type],
            );
        },
        [activeNonEmailMethods, recoverySecrets],
    );

    const verifyRecoverySecret = useCallback(
        async (
            type: RecoveryType,
            rawValue: string | string[],
        ): Promise<string | null> => {
            try {
                if (type === RecoveryType.QUESTIONS) {
                    const answers = rawValue as string[];

                    const result = await verifyQuestionsAction(answers);

                    if (!result.success || !result.data) {
                        return null;
                    }

                    return buildQuestionsSecret(answers);
                }

                if (type === RecoveryType.RECOVERY_PASSWORD) {
                    const password = (rawValue as string).trim();

                    const result = await verifyRecoveryPasswordAction(password);

                    if (!result.success || !result.data) {
                        return null;
                    }

                    return password;
                }

                if (type === RecoveryType.RECOVERY_KEY) {
                    const key = (rawValue as string).trim().toUpperCase();

                    const result = await verifyRecoveryKeyAction(key);

                    if (!result.success || !result.data) {
                        return null;
                    }

                    return key;
                }

                return null;
            } catch {
                return null;
            }
        },
        [],
    );
    const hasAllActiveRecoverySecrets = useCallback(
        (
            secretsOverride?: Partial<Record<RecoveryType, string>>,
            methodsOverride?: RecoveryMethod[],
        ) => {
            return (
                getMissingActiveRecoveryMethods(
                    secretsOverride,
                    methodsOverride,
                ).length === 0
            );
        },
        [getMissingActiveRecoveryMethods],
    );

    const createRecoveryDataPayload = useCallback(
        async (
            secretsOverride?: Partial<Record<RecoveryType, string>>,
            methodsOverride?: RecoveryMethod[],
        ): Promise<RecoveryDataPayload> => {
            if (!vaultKey) {
                throw new Error('Chave do cofre não encontrada.');
            }

            const secrets = getActiveRecoverySecrets(
                secretsOverride,
                methodsOverride,
            );

            if (secrets.length === 0) {
                throw new Error(
                    'É necessário possuir pelo menos um método de recuperação.',
                );
            }

            return createRecoveryData({
                vaultKey,
                recoverySecrets: secrets,
            });
        },
        [vaultKey, getActiveRecoverySecrets],
    );

    const persistRecoveryData = useCallback(
        async (recoveryData: RecoveryDataPayload) => {
            const result = await updateRecoveryDataAction(recoveryData);

            if (!result.success) {
                throw new Error(
                    result.error ??
                        'Erro ao atualizar os dados de recuperação.',
                );
            }

            return result.data;
        },
        [],
    );

    const handleUpdateRecoveryData = useCallback(
        async (
            secretsOverride?: Partial<Record<RecoveryType, string>>,
            methodsOverride?: RecoveryMethod[],
        ) => {
            try {
                const recoveryData = await createRecoveryDataPayload(
                    secretsOverride,
                    methodsOverride,
                );

                await persistRecoveryData(recoveryData);

                return true;
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : 'Erro ao atualizar dados de recuperação.',
                );

                return false;
            }
        },
        [createRecoveryDataPayload, persistRecoveryData],
    );

    const handleConfigureQuestions = useCallback(
        async (
            questions: QuizQuestion[],
            existingSecrets: Partial<Record<RecoveryType, string>> = {},
        ) => {
            try {
                setIsSubmitting(true);

                if (!vaultKey) {
                    throw new Error('Chave do cofre não encontrada.');
                }

                if (questions.length === 0) {
                    throw new Error(
                        'É necessário informar pelo menos uma pergunta.',
                    );
                }

                const normalizedQuestions = questions.map((question) => {
                    const normalizedQuestion = question.question.trim();

                    const normalizedAnswer = question.answer
                        .trim()
                        .toLowerCase();

                    if (!normalizedQuestion) {
                        throw new Error(
                            'Todas as perguntas precisam possuir uma pergunta válida.',
                        );
                    }

                    if (!normalizedAnswer) {
                        throw new Error(
                            'Todas as perguntas precisam possuir uma resposta.',
                        );
                    }

                    return {
                        question: normalizedQuestion,
                        answer: normalizedAnswer,
                    };
                });

                const answers = normalizedQuestions.map(
                    (question) => question.answer,
                );

                const questionsSecret = buildQuestionsSecret(answers);

                const updatedSecrets = {
                    ...recoverySecrets,
                    ...existingSecrets,
                    [RecoveryType.QUESTIONS]: questionsSecret,
                };

                const updatedMethods = methods
                    .map((method) =>
                        method.type === RecoveryType.QUESTIONS
                            ? { ...method, enabled: true }
                            : method,
                    )
                    .filter((method) => method.enabled);

                const result =
                    await configureRecoveryQuestionsAction(normalizedQuestions);

                if (!result.success) {
                    toast.error(
                        result.error ?? 'Erro ao configurar perguntas.',
                    );

                    return false;
                }

                setRecoverySecrets(updatedSecrets);

                const success = await handleUpdateRecoveryData(
                    updatedSecrets,
                    updatedMethods,
                );

                if (!success) {
                    return false;
                }

                await loadMethods();

                toast.success(
                    'Perguntas de segurança configuradas com sucesso.',
                );

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
        [
            vaultKey,
            recoverySecrets,
            methods,
            handleUpdateRecoveryData,
            loadMethods,
        ],
    );

    const handleConfigureRecoveryPassword = useCallback(
        async (
            recoveryPassword: string,
            existingSecrets: Partial<Record<RecoveryType, string>> = {},
        ) => {
            try {
                setIsSubmitting(true);

                const normalizedPassword = recoveryPassword.trim();

                if (!normalizedPassword) {
                    throw new Error('A senha de recuperação é obrigatória.');
                }

                const updatedSecrets = {
                    ...recoverySecrets,
                    ...existingSecrets,
                    [RecoveryType.RECOVERY_PASSWORD]: normalizedPassword,
                };

                const updatedMethods = methods
                    .map((method) =>
                        method.type === RecoveryType.RECOVERY_PASSWORD
                            ? { ...method, enabled: true }
                            : method,
                    )
                    .filter((method) => method.enabled);

                getActiveRecoverySecrets(updatedSecrets, updatedMethods);

                const result =
                    await configureRecoveryPasswordAction(normalizedPassword);

                if (!result.success) {
                    toast.error(
                        result.error ??
                            'Erro ao configurar senha de recuperação.',
                    );

                    return false;
                }

                setRecoverySecrets(updatedSecrets);

                const success = await handleUpdateRecoveryData(
                    updatedSecrets,
                    updatedMethods,
                );

                if (!success) {
                    return false;
                }

                await loadMethods();

                toast.success('Senha de recuperação configurada com sucesso.');

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
        [
            recoverySecrets,
            methods,
            getActiveRecoverySecrets,
            handleUpdateRecoveryData,
            loadMethods,
        ],
    );

    const handleGenerateRecoveryKey = useCallback(
        async (
            existingSecrets: Partial<Record<RecoveryType, string>> = {},
        ): Promise<string> => {
            try {
                setIsSubmitting(true);

                const recoveryKey = generateRecoveryKey();

                const recoveryKeyHash = await generateSha256(recoveryKey);

                const updatedSecrets = {
                    ...recoverySecrets,
                    ...existingSecrets,
                    [RecoveryType.RECOVERY_KEY]: recoveryKey,
                };

                const updatedMethods = methods
                    .map((method) =>
                        method.type === RecoveryType.RECOVERY_KEY
                            ? { ...method, enabled: true }
                            : method,
                    )
                    .filter((method) => method.enabled);

                getActiveRecoverySecrets(updatedSecrets, updatedMethods);

                const result = await generateRecoveryKeyAction(recoveryKeyHash);

                if (!result.success) {
                    throw new Error(
                        result.error ?? 'Erro ao gerar chave de recuperação.',
                    );
                }

                setRecoverySecrets(updatedSecrets);

                const success = await handleUpdateRecoveryData(
                    updatedSecrets,
                    updatedMethods,
                );

                if (!success) {
                    throw new Error(
                        'A chave foi criada, mas os dados de recuperação não puderam ser atualizados.',
                    );
                }

                return recoveryKey;
            } catch (error) {
                throw new Error(
                    error instanceof Error
                        ? error.message
                        : 'Erro ao gerar chave de recuperação.',
                );
            } finally {
                setIsSubmitting(false);
            }
        },
        [
            recoverySecrets,
            methods,
            getActiveRecoverySecrets,
            handleUpdateRecoveryData,
        ],
    );

    const handleDisableMethod = useCallback(
        async (
            type: RecoveryType,
            existingSecrets: Partial<Record<RecoveryType, string>> = {},
        ) => {
            try {
                setIsSubmitting(true);

                const method = methods.find((item) => item.type === type);

                if (!method) {
                    throw new Error('Método de recuperação não encontrado.');
                }

                const updatedSecrets = {
                    ...recoverySecrets,
                    ...existingSecrets,
                };

                delete updatedSecrets[type];

                const remainingMethods = activeNonEmailMethods.filter(
                    (item) => item.type !== type,
                );

                if (remainingMethods.length > 0) {
                    getActiveRecoverySecrets(updatedSecrets, remainingMethods);
                }

                const result = await disableRecoveryMethodAction(type);

                if (!result.success) {
                    toast.error(result.error ?? 'Erro ao desativar método.');

                    return false;
                }

                setRecoverySecrets(updatedSecrets);

                if (remainingMethods.length > 0) {
                    const success = await handleUpdateRecoveryData(
                        updatedSecrets,
                        remainingMethods,
                    );

                    if (!success) {
                        return false;
                    }
                } else {
                    const deleteResult = await deleteRecoveryDataAction();

                    if (!deleteResult.success) {
                        toast.error(
                            deleteResult.error ??
                                'Erro ao remover os dados de recuperação.',
                        );
                        return false;
                    }
                }

                await loadMethods();

                toast.success('Método de recuperação desativado.');

                return true;
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : 'Erro ao desativar método de recuperação.',
                );

                return false;
            } finally {
                setIsSubmitting(false);
            }
        },
        [
            methods,
            activeNonEmailMethods,
            recoverySecrets,
            getActiveRecoverySecrets,
            handleUpdateRecoveryData,
            loadMethods,
        ],
    );

    return {
        methods,
        activeMethods,
        activeNonEmailMethods,

        isLoading,
        isSubmitting,

        hasRecoveryKey,

        recoverySecrets,

        loadMethods,
        getMethod,

        setRecoverySecret,
        clearRecoverySecret,
        clearRecoverySecrets,

        getQuestionsForReauth,
        getMissingActiveRecoveryMethods,
        verifyRecoverySecret,
        hasAllActiveRecoverySecrets,

        handleDisableMethod,
        handleConfigureQuestions,
        handleConfigureRecoveryPassword,
        handleGenerateRecoveryKey,

        createRecoveryDataPayload,
        handleUpdateRecoveryData,
    };
}
