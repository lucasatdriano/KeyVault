'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import CredentialCard from '@/src/client/components/ui/cards/CredentialCard';
import { Credential } from '@/src/shared/types/credential';
import ViewCredentialModal from '@/src/client/components/layout/modals/credentialsModals/ViewCredentialModal';
import Header from '@/src/client/components/layout/header/Header';

const credentialsData: Credential[] = [
    {
        id: '1',
        userId: 'user-1',
        categoryId: 'cat-1',
        category: 'Desenvolvimento',
        title: 'GitHub',
        username: 'alex.ferreira',
        email: 'alex.ferreira@email.com',
        phone: '',
        password: 'MinhaSenha123!',
        url: 'https://github.com',
        notes: 'Conta principal do GitHub',
        favorite: true,
        createdAt: '2024-06-20T10:00:00Z',
        updatedAt: '2024-06-20T10:00:00Z',
    },
    {
        id: '2',
        userId: 'user-1',
        categoryId: 'cat-2',
        category: 'E-mail',
        title: 'Gmail Pessoal',
        username: 'alex.ferreira',
        email: 'alex.ferreira@gmail.com',
        phone: '',
        password: 'OutraSenha456!',
        url: 'https://gmail.com',
        notes: 'E-mail pessoal',
        favorite: true,
        createdAt: '2024-05-10T10:00:00Z',
        updatedAt: '2024-05-10T10:00:00Z',
    },
    {
        id: '3',
        userId: 'user-1',
        categoryId: 'cat-3',
        category: 'Finanças',
        title: 'Nubank',
        username: 'alex.ferreira',
        email: 'alex.ferreira@gmail.com',
        phone: '(11) 99887-6655',
        password: '',
        url: 'https://nubank.com.br',
        notes: 'Conta corrente principal',
        favorite: false,
        createdAt: '2024-07-01T10:00:00Z',
        updatedAt: '2024-07-01T10:00:00Z',
    },
    {
        id: '7',
        userId: 'user-1',
        categoryId: 'cat-1',
        category: 'Desenvolvimento',
        title: 'AWS Console',
        username: 'alex.ferreira',
        email: 'alex.ferreira@startupxyz.com.br',
        phone: '',
        password: 'AWS123!',
        url: 'https://aws.amazon.com/console',
        notes: 'Console AWS da empresa',
        favorite: true,
        createdAt: '2024-07-05T10:00:00Z',
        updatedAt: '2024-07-05T10:00:00Z',
    },
];

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export default function FavoritesPage() {
    const router = useRouter();
    const [credentials, setCredentials] =
        useState<Credential[]>(credentialsData);
    const [selectedCredential, setSelectedCredential] =
        useState<Credential | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const favorites = credentials.filter((c) => c.favorite);

    const handleCardClick = (credential: Credential) => {
        setSelectedCredential(credential);
        setIsViewModalOpen(true);
    };

    const handleEdit = (credential: Credential) => {
        console.log('Editando:', credential);
        setCredentials((prev) =>
            prev.map((c) => (c.id === credential.id ? credential : c)),
        );
        setIsViewModalOpen(false);
    };

    const handleDelete = (id: string) => {
        console.log('Excluir:', id);
        setCredentials((prev) => prev.filter((c) => c.id !== id));
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        console.log('Buscando:', query);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        console.log('Copiado:', text);
    };

    const handleToggleFavorite = (id: string) => {
        setCredentials((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, favorite: !c.favorite } : c,
            ),
        );
    };

    return (
        <div className="space-y-6">
            <Header
                variant="favorites"
                credentialCount={3}
                onSearch={handleSearch}
            />

            {favorites.length > 0 ? (
                <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((cred) => (
                        <CredentialCard
                            key={cred.id}
                            credential={{
                                ...cred,
                                createdAt: formatDate(cred.createdAt),
                            }}
                            onClick={() => handleCardClick(cred)}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onCopy={handleCopy}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-10 h-10 text-yellow-500/40" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        Nenhum favorito ainda
                    </h3>
                    <p className="text-foreground/40 text-sm max-w-sm mx-auto">
                        Marque suas credenciais mais importantes como favoritas
                        clicando na estrela ⭐
                    </p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="mt-4 text-primary hover:underline text-sm"
                    >
                        Ver todas as credenciais
                    </button>
                </div>
            )}

            <ViewCredentialModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedCredential(null);
                }}
                credential={selectedCredential}
                onEdit={handleEdit}
            />
        </div>
    );
}
