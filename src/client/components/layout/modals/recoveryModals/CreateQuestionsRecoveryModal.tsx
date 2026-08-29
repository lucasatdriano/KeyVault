/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import {
    PlusIcon,
    PencilIcon,
    AlertCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckIcon,
    HelpCircleIcon,
    KeyIcon,
} from 'lucide-react';

import { hasValidationErrors } from '@/src/client/validators';
import { validateQuizQuestion } from '@/src/client/validators/recovery.validator';
import {
    CreateQuizQuestionFormData,
    QuizQuestion,
} from '@/src/client/types/recovery';

import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import ModalBase from '@/src/client/components/layout/modals/ModalBase';

interface QuizFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (questions: QuizQuestion[]) => Promise<boolean>;
    initialQuestions?: QuizQuestion[];
    title?: string;
    maxQuestions?: number;
    isLoading?: boolean;
}

export default function QuizFormModal({
    isOpen,
    onClose,
    onSave,
    initialQuestions = [],
    title = 'Criar perguntas de segurança',
    maxQuestions = 3,
    isLoading = false,
}: QuizFormModalProps) {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [formData, setFormData] = useState<CreateQuizQuestionFormData>({
        question: '',
        answer: '',
    });

    const [errors, setErrors] = useState<CreateQuizQuestionFormData>({
        question: '',
        answer: '',
    });

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const firstQuestion = initialQuestions[0];

        setQuestions(initialQuestions);
        setCurrentIndex(0);

        setFormData({
            question: firstQuestion?.question ?? '',
            answer: firstQuestion?.answer ?? '',
        });

        setErrors({
            question: '',
            answer: '',
        });
    }, [isOpen, initialQuestions]);

    const resetForm = () => {
        setQuestions([]);
        setCurrentIndex(0);

        setFormData({
            question: '',
            answer: '',
        });

        setErrors({
            question: '',
            answer: '',
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const saveCurrentQuestion = (): QuizQuestion | null => {
        const validationErrors = validateQuizQuestion({
            question: formData.question,
            answer: formData.answer,
        });

        setErrors({
            question: validationErrors.question ?? '',
            answer: validationErrors.answer ?? '',
        });

        if (hasValidationErrors(validationErrors)) {
            return null;
        }

        return {
            ...(questions[currentIndex]?.id
                ? { id: questions[currentIndex].id }
                : {}),
            question: formData.question.trim(),
            answer: formData.answer.trim(),
        };
    };

    const updateCurrentQuestion = (question: QuizQuestion): QuizQuestion[] => {
        const updatedQuestions = [...questions];

        updatedQuestions[currentIndex] = question;

        setQuestions(updatedQuestions);

        return updatedQuestions;
    };

    const handleNext = () => {
        const question = saveCurrentQuestion();

        if (!question) {
            return;
        }

        const updatedQuestions = updateCurrentQuestion(question);

        const nextIndex = currentIndex + 1;

        setCurrentIndex(nextIndex);

        const nextQuestion = updatedQuestions[nextIndex];

        setFormData({
            question: nextQuestion?.question ?? '',
            answer: nextQuestion?.answer ?? '',
        });

        setErrors({
            question: '',
            answer: '',
        });
    };

    const handlePrevious = () => {
        if (currentIndex === 0) {
            return;
        }

        const updatedQuestions = [...questions];

        if (formData.question.trim() || formData.answer.trim()) {
            updatedQuestions[currentIndex] = {
                ...updatedQuestions[currentIndex],
                question: formData.question.trim(),
                answer: formData.answer.trim(),
            };

            setQuestions(updatedQuestions);
        }

        const previousIndex = currentIndex - 1;
        const previousQuestion = updatedQuestions[previousIndex];

        setCurrentIndex(previousIndex);

        setFormData({
            question: previousQuestion?.question ?? '',
            answer: previousQuestion?.answer ?? '',
        });

        setErrors({
            question: '',
            answer: '',
        });
    };

    const handleSave = async () => {
        const question = saveCurrentQuestion();

        if (!question) {
            return;
        }

        const updatedQuestions = updateCurrentQuestion(question);

        const success = await onSave(updatedQuestions);

        if (success) {
            handleClose();
        }
    };

    const isLastQuestion = currentIndex === maxQuestions - 1;
    const isFirstQuestion = currentIndex === 0;

    const isNextDisabled = !formData.question.trim() || !formData.answer.trim();

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            icon={
                initialQuestions.length > 0 ? (
                    <PencilIcon className="w-5 h-5 text-primary" />
                ) : (
                    <PlusIcon className="w-5 h-5 text-primary" />
                )
            }
            maxWidth="lg"
            footer={
                <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            onClick={handlePrevious}
                            disabled={isFirstQuestion || isLoading}
                            variant="secondary"
                            leftIcon={<ChevronLeftIcon className="w-4 h-4" />}
                        >
                            Anterior
                        </Button>
                    </div>

                    <div className="flex gap-3">
                        {isLastQuestion ? (
                            <Button
                                type="button"
                                onClick={handleSave}
                                disabled={
                                    !formData.question.trim() ||
                                    !formData.answer.trim() ||
                                    isLoading
                                }
                                isLoading={isLoading}
                                loadingText="Salvando..."
                                leftIcon={<CheckIcon className="w-4 h-4" />}
                            >
                                Salvar
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleNext}
                                disabled={isNextDisabled || isLoading}
                                rightIcon={
                                    <ChevronRightIcon className="w-4 h-4" />
                                }
                            >
                                Próxima
                            </Button>
                        )}
                    </div>
                </div>
            }
        >
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/60">
                        Pergunta {currentIndex + 1} de {maxQuestions}
                    </span>

                    <div className="flex gap-1">
                        {Array.from({ length: maxQuestions }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className={`h-1.5 w-8 rounded-full transition-colors ${
                                        index === currentIndex
                                            ? 'bg-primary'
                                            : index < questions.length ||
                                                (index === questions.length &&
                                                    formData.question.trim())
                                              ? 'bg-primary/40'
                                              : 'bg-white/10'
                                    }`}
                                />
                            ),
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />

                        <p className="text-sm text-blue-500/80">
                            Crie uma pergunta e uma resposta com uma palavra. A
                            pergunta tem que ser algo que apenas você saiba.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <InputTextForm
                        label={`Pergunta ${currentIndex + 1}`}
                        name={`question-${currentIndex}`}
                        type="text"
                        placeholder="Ex: Qual o nome do meu primeiro pet?"
                        value={formData.question}
                        disabled={isLoading}
                        onChange={(e) => {
                            setFormData((prev) => ({
                                ...prev,
                                question: e.target.value,
                            }));

                            if (errors.question) {
                                setErrors((prev) => ({
                                    ...prev,
                                    question: '',
                                }));
                            }
                        }}
                        error={errors.question}
                        leftIcon={<HelpCircleIcon className="w-5 h-5" />}
                    />

                    <InputTextForm
                        label={`Resposta ${currentIndex + 1}`}
                        name={`answer-${currentIndex}`}
                        type="text"
                        placeholder="Ex: Max"
                        value={formData.answer}
                        disabled={isLoading}
                        onChange={(e) => {
                            setFormData((prev) => ({
                                ...prev,
                                answer: e.target.value,
                            }));

                            if (errors.answer) {
                                setErrors((prev) => ({
                                    ...prev,
                                    answer: '',
                                }));
                            }
                        }}
                        error={errors.answer}
                        leftIcon={<KeyIcon className="w-5 h-5" />}
                    />
                </div>
            </form>
        </ModalBase>
    );
}
