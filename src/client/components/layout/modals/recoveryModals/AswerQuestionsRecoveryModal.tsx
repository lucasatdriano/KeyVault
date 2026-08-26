/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import {
    ShieldIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckIcon,
    AlertCircleIcon,
} from 'lucide-react';

import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import ModalBase from '../ModalBase';

interface QuizQuestion {
    id?: string;
    question: string;
}

interface QuizAnswerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (answers: string[]) => Promise<void> | void;
    questions: QuizQuestion[];
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
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setCurrentIndex(0);
        setAnswers([]);
        setCurrentAnswer('');
        setError('');
    }, [isOpen]);

    const saveCurrentAnswer = (): string[] | null => {
        const normalizedAnswer = currentAnswer.trim();

        if (!normalizedAnswer) {
            setError('Por favor, digite sua resposta.');

            return null;
        }

        const updatedAnswers = [...answers];

        updatedAnswers[currentIndex] = normalizedAnswer;

        setAnswers(updatedAnswers);
        setError('');

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
        setCurrentAnswer(updatedAnswers[nextIndex] ?? '');
    };

    const handlePrevious = () => {
        if (currentIndex === 0) {
            return;
        }

        const updatedAnswers = [...answers];

        if (currentAnswer.trim()) {
            updatedAnswers[currentIndex] = currentAnswer.trim();

            setAnswers(updatedAnswers);
        }

        const previousIndex = currentIndex - 1;

        setCurrentIndex(previousIndex);
        setCurrentAnswer(updatedAnswers[previousIndex] ?? '');
        setError('');
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
                        {questions[currentIndex]?.question}
                    </p>
                </div>

                <InputTextForm
                    label="Sua resposta"
                    name="answer"
                    type="text"
                    placeholder="Digite sua resposta..."
                    value={currentAnswer}
                    disabled={isLoading}
                    onChange={(e) => {
                        setCurrentAnswer(e.target.value);

                        if (error) {
                            setError('');
                        }
                    }}
                    error={error}
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
                            disabled={!currentAnswer.trim() || isLoading}
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
                            disabled={!currentAnswer.trim() || isLoading}
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
