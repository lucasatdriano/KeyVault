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

import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import ModalBase from '../ModalBase';

interface QuizQuestion {
    id?: string;
    question: string;
    answer: string;
}

const EMPTY_QUESTIONS: QuizQuestion[] = [];

interface QuizFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (questions: QuizQuestion[]) => void;
    initialQuestions?: QuizQuestion[];
    title?: string;
    maxQuestions?: number;
    isLoading?: boolean;
}

export default function QuizFormModal({
    isOpen,
    onClose,
    onSave,
    initialQuestions = EMPTY_QUESTIONS,
    title = 'Criar perguntas de segurança',
    maxQuestions = 3,
    isLoading = false,
}: QuizFormModalProps) {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [errors, setErrors] = useState({ question: '', answer: '' });

    useEffect(() => {
        if (!isOpen) return;

        const firstQuestion = initialQuestions[0];

        setQuestions(initialQuestions);
        setCurrentIndex(0);
        setCurrentQuestion(firstQuestion?.question ?? '');
        setCurrentAnswer(firstQuestion?.answer ?? '');
        setErrors({
            question: '',
            answer: '',
        });
    }, [isOpen, initialQuestions]);

    const resetForm = () => {
        setQuestions([]);
        setCurrentIndex(0);
        setCurrentQuestion('');
        setCurrentAnswer('');
        setErrors({ question: '', answer: '' });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleNext = () => {
        if (!currentQuestion.trim()) {
            setErrors((prev) => ({
                ...prev,
                question: 'A pergunta é obrigatória.',
            }));
            return;
        }
        if (!currentAnswer.trim()) {
            setErrors((prev) => ({
                ...prev,
                answer: 'A resposta é obrigatória.',
            }));
            return;
        }

        const updatedQuestions = [...questions];
        if (updatedQuestions[currentIndex]) {
            updatedQuestions[currentIndex] = {
                ...updatedQuestions[currentIndex],
                question: currentQuestion.trim(),
                answer: currentAnswer.trim(),
            };
        } else {
            updatedQuestions.push({
                question: currentQuestion.trim(),
                answer: currentAnswer.trim(),
            });
        }
        setQuestions(updatedQuestions);
        setErrors({ question: '', answer: '' });

        if (currentIndex < maxQuestions - 1) {
            setCurrentIndex(currentIndex + 1);
            const nextQuestion = updatedQuestions[currentIndex + 1];
            setCurrentQuestion(nextQuestion?.question || '');
            setCurrentAnswer(nextQuestion?.answer || '');
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            if (currentQuestion.trim() || currentAnswer.trim()) {
                const updatedQuestions = [...questions];
                if (updatedQuestions[currentIndex]) {
                    updatedQuestions[currentIndex] = {
                        ...updatedQuestions[currentIndex],
                        question:
                            currentQuestion.trim() ||
                            updatedQuestions[currentIndex].question,
                        answer:
                            currentAnswer.trim() ||
                            updatedQuestions[currentIndex].answer,
                    };
                } else if (currentQuestion.trim() || currentAnswer.trim()) {
                    updatedQuestions.push({
                        question: currentQuestion.trim(),
                        answer: currentAnswer.trim(),
                    });
                }
                setQuestions(updatedQuestions);
            }

            setCurrentIndex(currentIndex - 1);
            const prevQuestion = questions[currentIndex - 1];
            setCurrentQuestion(prevQuestion?.question || '');
            setCurrentAnswer(prevQuestion?.answer || '');
            setErrors({ question: '', answer: '' });
        }
    };

    const handleSave = () => {
        if (!currentQuestion.trim()) {
            setErrors((prev) => ({
                ...prev,
                question: 'A pergunta é obrigatória.',
            }));

            return;
        }

        if (!currentAnswer.trim()) {
            setErrors((prev) => ({
                ...prev,
                answer: 'A resposta é obrigatória.',
            }));

            return;
        }

        const updatedQuestions = [...questions];

        if (updatedQuestions[currentIndex]) {
            updatedQuestions[currentIndex] = {
                ...updatedQuestions[currentIndex],
                question: currentQuestion.trim(),
                answer: currentAnswer.trim(),
            };
        } else {
            updatedQuestions.push({
                question: currentQuestion.trim(),
                answer: currentAnswer.trim(),
            });
        }

        setQuestions(updatedQuestions);

        onSave(updatedQuestions);

        handleClose();
    };

    const isLastQuestion = currentIndex === maxQuestions - 1;
    const isFirstQuestion = currentIndex === 0;

    const isNextDisabled = !currentQuestion.trim() || !currentAnswer.trim();

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
                                    !currentQuestion.trim() ||
                                    !currentAnswer.trim() ||
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
                                                    currentQuestion.trim())
                                              ? 'bg-primary/40'
                                              : 'bg-white/10'
                                    }`}
                                />
                            ),
                        )}
                    </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertCircleIcon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
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
                        value={currentQuestion}
                        onChange={(e) => {
                            setCurrentQuestion(e.target.value);
                            if (errors.question)
                                setErrors((prev) => ({
                                    ...prev,
                                    question: '',
                                }));
                        }}
                        error={errors.question}
                        leftIcon={<HelpCircleIcon className="w-5 h-5" />}
                    />

                    <InputTextForm
                        label={`Resposta ${currentIndex + 1}`}
                        name={`answer-${currentIndex}`}
                        type="text"
                        placeholder="Ex: Max"
                        value={currentAnswer}
                        onChange={(e) => {
                            setCurrentAnswer(e.target.value);
                            if (errors.answer)
                                setErrors((prev) => ({ ...prev, answer: '' }));
                        }}
                        error={errors.answer}
                        leftIcon={<KeyIcon className="w-5 h-5" />}
                    />
                </div>
            </form>
        </ModalBase>
    );
}
