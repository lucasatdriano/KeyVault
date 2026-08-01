'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertCircle } from 'lucide-react';
import { Credential } from '@/src/shared/types/credential';
import Header from '@/src/client/components/layout/header/Header';
import Button from '@/src/client/components/ui/buttons/Button';
import DeletedCredentialCard from '@/src/client/components/ui/cards/DeletedCredentialCard';

const trashData: Credential[] = [
    {
        id: 'trash-1',
        userId: 'user-1',
        categoryId: 'cat-3',
        category: 'Finanças',
        title: 'Banco do Brasil',
        username: 'alex.ferreira',
        email: 'alex.ferreira@bb.com.br',
        phone: '',
        password: 'BB123!',
        url: 'https://bb.com.br',
        notes: 'Conta excluída em 20/07/2024',
        favorite: false,
        createdAt: '2024-06-10T10:00:00Z',
        updatedAt: '2024-07-20T10:00:00Z',
    },
    {
        id: 'trash-2',
        userId: 'user-1',
        categoryId: 'cat-6',
        category: 'Redes Sociais',
        title: 'Twitter/X',
        username: '@alex_dev',
        email: 'alex@twitter.com',
        phone: '',
        password: 'Twitter123!',
        url: 'https://twitter.com',
        notes: 'Conta excluída em 18/07/2024',
        favorite: false,
        createdAt: '2024-05-15T10:00:00Z',
        updatedAt: '2024-07-18T10:00:00Z',
    },
    {
        id: 'trash-3',
        userId: 'user-1',
        categoryId: 'cat-5',
        category: 'Trabalho',
        title: 'Notion',
        username: 'alex@empresa.com',
        email: 'alex@empresa.com',
        phone: '',
        password: 'Notion456!',
        url: 'https://notion.so',
        notes: 'Conta excluída em 15/07/2024',
        favorite: false,
        createdAt: '2024-04-20T10:00:00Z',
        updatedAt: '2024-07-15T10:00:00Z',
    },
];

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getDaysRemaining = (deletedAt: string) => {
    const deleted = new Date(deletedAt);
    const now = new Date();
    const diffTime =
        deleted.getTime() + 30 * 24 * 60 * 60 * 1000 - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export default function TrashPage() {
    const router = useRouter();
    const [trashItems, setTrashItems] = useState<Credential[]>(trashData);

    const handleRestore = (id: string) => {
        console.log('Restaurar:', id);
        setTrashItems((prev) => prev.filter((c) => c.id !== id));
    };

    const handlePermanentDelete = (id: string) => {
        console.log('Excluir permanentemente:', id);
        setTrashItems((prev) => prev.filter((c) => c.id !== id));
    };

    const handleClearTrash = () => {
        console.log('Esvaziar lixeira');
        setTrashItems([]);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        console.log('Buscando:', query);
    };

    const getInitials = (title: string) => {
        return title
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'E-mail': 'from-blue-500 to-blue-600',
            Desenvolvimento: 'from-purple-500 to-purple-600',
            Streaming: 'from-error to-red-600',
            Música: 'from-green-500 to-green-600',
            Compras: 'from-orange-500 to-orange-600',
            'Redes Sociais': 'from-pink-500 to-pink-600',
            Finanças: 'from-emerald-500 to-emerald-600',
            Trabalho: 'from-indigo-500 to-indigo-600',
        };
        return colors[category] || 'from-primary to-secondary';
    };

    return (
        <div className="space-y-6">
            <Header
                variant="trash"
                credentialCount={3}
                onSearch={handleSearch}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-end px-4">
                {trashItems.length > 0 && (
                    <>
                        <Button
                            variant="error"
                            size="sm"
                            leftIcon={<Trash2 className="w-4 h-4" />}
                        >
                            Esvaziar Lixeira
                        </Button>
                    </>
                )}
            </div>

            {trashItems.length > 0 ? (
                <div className="space-y-3 px-4">
                    {trashItems.map((item) => (
                        <DeletedCredentialCard
                            key={item.id}
                            credential={item}
                            onRestore={handleRestore}
                            onPermanentDelete={handlePermanentDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-10 h-10 text-error/40" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        Lixeira vazia
                    </h3>
                    <p className="text-foreground/40 text-sm max-w-sm mx-auto">
                        Credenciais excluídas aparecerão aqui por 30 dias. Você
                        pode restaurá-las a qualquer momento.
                    </p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="mt-4 text-primary hover:underline text-sm"
                    >
                        Voltar para o dashboard
                    </button>
                </div>
            )}

            {trashItems.length > 0 && (
                <div className="mx-4 bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-start gap-3 px">
                        <AlertCircle className="w-5 h-5 text-foreground/30 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-foreground/60">
                                <span className="font-medium text-foreground/80">
                                    Retenção de 30 dias:
                                </span>{' '}
                                Credenciais excluídas permanecem na lixeira por
                                30 dias antes de serem permanentemente
                                removidas.
                            </p>
                            <p className="text-xs text-foreground/30 mt-1">
                                {trashItems.length}{' '}
                                {trashItems.length === 1
                                    ? 'credencial'
                                    : 'credenciais'}{' '}
                                na lixeira
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
