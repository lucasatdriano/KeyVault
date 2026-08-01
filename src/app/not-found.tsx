'use client';

import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '@/src/client/components/ui/buttons/Button';
import Logo from '../client/components/layout/logo/Logo';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
            <div className="absolute -top-25 -right-25 w-64 h-64 bg-primary/20 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-25 -left-25 w-80 h-80 bg-secondary/20 rounded-full opacity-20 blur-3xl"></div>

            <div className="relative z-10 w-full max-w-md text-center">
                <div className="flex justify-center mb-8">
                    <Logo variant="icon" size="xl"></Logo>
                </div>

                <div className="mb-6">
                    <h1 className="text-8xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                        404
                    </h1>
                    <div className="h-1 w-20 mx-auto mt-2 bg-linear-to-r from-primary to-secondary rounded-full"></div>
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">
                    Página não encontrada
                </h2>

                <p className="text-foreground/60 text-sm mb-8 max-w-sm mx-auto">
                    Oops! A página que você está procurando não existe ou foi
                    movida. Verifique o URL ou navegue para outra página.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => router.push('/dashboard')}
                        leftIcon={<Home className="w-5 h-5" />}
                        fullWidth
                    >
                        Ir para o Dashboard
                    </Button>

                    <Button
                        onClick={() => router.back()}
                        variant="secondary"
                        leftIcon={<ArrowLeft className="w-5 h-5" />}
                        fullWidth
                    >
                        Voltar
                    </Button>
                </div>

                <div className="mt-12 pt-6 border-t border-white/10">
                    <p className="text-foreground/30 text-xs">
                        Criptografia de ponta a ponta · Sem acesso aos seus
                        dados .
                    </p>
                </div>
            </div>
        </div>
    );
}
