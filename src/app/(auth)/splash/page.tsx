'use client';

import React, { useEffect, useState } from 'react';
import Logo from '@/src/components/layout/logo/Logo';

interface SplashScreenProps {
    onGetStarted?: () => void;
    loadingDuration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
    onGetStarted,
    loadingDuration = 1500,
}) => {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const interval = 50;
        const steps = loadingDuration / interval;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const newProgress = (currentStep / steps) * 100;

            if (newProgress >= 100) {
                setProgress(100);
                clearInterval(timer);
                setIsLoading(false);

                setTimeout(() => {
                    onGetStarted?.();
                }, 300);
            } else {
                setProgress(newProgress);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [loadingDuration, onGetStarted]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-between relative">
            <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="relative z-10 mb-8">
                    <Logo variant="icon" size="xl"></Logo>
                </div>

                <h1 className="text-5xl font-bold text-foreground mb-3 relative z-10 tracking-tight">
                    KeyVault
                </h1>

                <p className="text-foreground/80 text-lg text-center max-w-xs relative z-10 font-light">
                    Suas senhas, protegidas por você.
                </p>

                <div className="mt-12 w-full max-w-sm relative z-10">
                    <div className="relative w-full h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-secondary to-primary rounded-full transition-all duration-200 ease-out"
                            style={{
                                width: `${Math.min(progress, 100)}%`,
                                opacity: 1,
                            }}
                        />
                    </div>

                    <p className="text-foreground/40 text-xs text-center mt-3 font-medium">
                        {isLoading
                            ? `Carregando... ${Math.round(progress)}%`
                            : 'Pronto!'}
                    </p>
                </div>
            </div>

            <p className="text-foreground/40 text-sm text-center py-6 relative z-10 font-light w-full">
                Criptografia de ponta a ponta · Sem acesso aos seus dados
            </p>
        </div>
    );
};

export default SplashScreen;
