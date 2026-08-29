/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import {
    ShieldIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckIcon,
    AlertCircleIcon,
    KeyIcon,
} from 'lucide-react';

import { hasValidationErrors } from '@/src/client/validators';
import { validateRecoveryAnswer } from '@/src/client/validators/recovery.validator';
import {
    RecoveryAnswerFormData,
    RecoveryQuestion,
} from '@/src/client/types/recovery';

import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import ModalBase from '@/src/client/components/layout/modals/ModalBase';

interface QuizAnswerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (answers: string[]) => Promise<void> | void;
    questions: RecoveryQuestion[];
    title?: string;
    isLoading?: boolean;
}

export default function QuizAnswerModal({
    isOpen,
    onClose,
    onVerify,
    questions,
    title = 'Verificação de segurança',
    isLoading = false,
}: QuizAnswerModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [formData, setFormData] = useState<RecoveryAnswerFormData>({
        answer: '',
    });
    const [errors, setErrors] = useState<RecoveryAnswerFormData>({
        answer: '',
    });

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setCurrentIndex(0);
        setAnswers([]);

        setFormData({
            answer: '',
        });

        setErrors({
            answer: '',
        });
    }, [isOpen]);

    const saveCurrentAnswer = (): string[] | null => {
        const validationErrors = validateRecoveryAnswer({
            answer: formData.answer,
        });

        setErrors({
            answer: validationErrors.answer ?? '',
        });

        if (hasValidationErrors(validationErrors)) {
            return null;
        }

        const updatedAnswers = [...answers];

        updatedAnswers[currentIndex] = formData.answer.trim();

        setAnswers(updatedAnswers);

        return updatedAnswers;
    };

    const handleNext = () => {
        const updatedAnswers = saveCurrentAnswer();

        if (!updatedAnswers) {
            return;
        }

        if (currentIndex >= questions.length - 1) {
            return;
        }

        const nextIndex = currentIndex + 1;

        setCurrentIndex(nextIndex);

        setFormData({
            answer: updatedAnswers[nextIndex] ?? '',
        });

        setErrors({
            answer: '',
        });
    };

    const handlePrevious = () => {
        const updatedAnswers = [...answers];

        if (formData.answer.trim()) {
            updatedAnswers[currentIndex] = formData.answer.trim();

            setAnswers(updatedAnswers);
        }

        const previousIndex = currentIndex - 1;

        setCurrentIndex(previousIndex);

        setFormData({
            answer: updatedAnswers[previousIndex] ?? '',
        });

        setErrors({
            answer: '',
        });
    };

    const handleVerify = async () => {
        const finalAnswers = saveCurrentAnswer();

        if (!finalAnswers) {
            return;
        }

        await onVerify(finalAnswers);
    };

    const isFirstQuestion = currentIndex === 0;
    const isLastQuestion = currentIndex === questions.length - 1;

    if (questions.length === 0) {
        return (
            <ModalBase
                isOpen={isOpen}
                onClose={onClose}
                title={title}
                icon={<ShieldIcon className="h-5 w-5 text-primary" />}
                maxWidth="lg"
                canClose={!isLoading}
            >
                <div className="space-y-6">
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                            <div>
                                <p className="font-medium text-red-500">
                                    Perguntas não encontradas
                                </p>

                                <p className="mt-1 text-sm text-red-500/80">
                                    Não foi possível carregar suas perguntas de
                                    recuperação.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={onClose}
                        fullWidth
                        variant="secondary"
                    >
                        Voltar
                    </Button>
                </div>
            </ModalBase>
        );
    }

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            icon={<ShieldIcon className="h-5 w-5 text-primary" />}
            maxWidth="lg"
            canClose={!isLoading}
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/60">
                        Pergunta {currentIndex + 1} de {questions.length}
                    </span>

                    <div className="flex gap-1">
                        {questions.map((_, index) => {
                            const isCurrent = index === currentIndex;

                            const isAnswered =
                                Boolean(answers[index]) && !isCurrent;

                            return (
                                <div
                                    key={index}
                                    className={`h-1.5 w-8 rounded-full transition-colors ${
                                        isCurrent
                                            ? 'bg-primary'
                                            : isAnswered
                                              ? 'bg-green-500'
                                              : 'bg-white/10'
                                    }`}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

                        <p className="text-sm text-amber-500/80">
                            Responda corretamente todas as perguntas para
                            verificar sua identidade.
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <p className="text-lg font-medium text-foreground">
                        {questions[currentIndex]?.question}?
                    </p>
                </div>

                <InputTextForm
                    label="Sua resposta"
                    name="answer"
                    type="text"
                    placeholder="Digite sua resposta..."
                    value={formData.answer}
                    disabled={isLoading}
                    onChange={(e) => {
                        setFormData({
                            answer: e.target.value,
                        });

                        if (errors.answer) {
                            setErrors({
                                answer: '',
                            });
                        }
                    }}
                    leftIcon={<KeyIcon className="h-5 w-5" />}
                    error={errors.answer}
                />

                <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <Button
                        type="button"
                        onClick={handlePrevious}
                        disabled={isFirstQuestion || isLoading}
                        variant="secondary"
                        leftIcon={<ChevronLeftIcon className="h-4 w-4" />}
                    >
                        Anterior
                    </Button>

                    {isLastQuestion ? (
                        <Button
                            type="button"
                            onClick={handleVerify}
                            disabled={!formData.answer.trim() || isLoading}
                            isLoading={isLoading}
                            loadingText="Verificando..."
                            leftIcon={<CheckIcon className="h-4 w-4" />}
                        >
                            Verificar
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={!formData.answer.trim() || isLoading}
                            rightIcon={<ChevronRightIcon className="h-4 w-4" />}
                        >
                            Próxima
                        </Button>
                    )}
                </div>
            </div>
        </ModalBase>
    );
}
