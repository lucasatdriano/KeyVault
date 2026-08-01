'use client';

import { useState } from 'react';
import { Key } from 'lucide-react';
import Header from '@/src/client/components/layout/header/Header';
import CredentialCard from '@/src/client/components/ui/cards/CredentialCard';
import ViewCredentialModal from '@/src/client/components/layout/modals/credentialsModals/ViewCredentialModal';
import { Credential, NewCredentialData } from '@/src/shared/types/credential';
import NewCredentialModal from '@/src/client/components/layout/modals/credentialsModals/NewCredentialModal';

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
        favorite: false,
        createdAt: '2024-05-10T10:00:00Z',
        updatedAt: '2024-05-10T10:00:00Z',
    },
    {
        id: '3',
        userId: 'user-1',
        categoryId: 'cat-3',
        category: 'Finanças',
        title: 'Nubank',
        username: '99887-6655',
        email: '',
        phone: '(11) 99887-6655',
        password: '',
        url: 'https://nubank.com.br',
        notes: 'Conta corrente principal',
        favorite: false,
        createdAt: '2024-07-01T10:00:00Z',
        updatedAt: '2024-07-01T10:00:00Z',
    },
    {
        id: '4',
        userId: 'user-1',
        categoryId: 'cat-4',
        category: 'Streaming',
        title: 'Netflix',
        username: 'alex.ferreira',
        email: 'alex.ferreira@gmail.com',
        phone: '',
        password: 'Netflix123!',
        url: 'https://netflix.com',
        notes: 'Conta compartilhada',
        favorite: false,
        createdAt: '2024-03-22T10:00:00Z',
        updatedAt: '2024-03-22T10:00:00Z',
    },
    {
        id: '5',
        userId: 'user-1',
        categoryId: 'cat-5',
        category: 'Trabalho',
        title: 'Slack Empresa',
        username: 'alex',
        email: 'alex@startupxyz.com.br',
        phone: '',
        password: 'Slack456!',
        url: 'https://startupxyz.slack.com',
        notes: 'Slack da empresa',
        favorite: false,
        createdAt: '2024-06-15T10:00:00Z',
        updatedAt: '2024-06-15T10:00:00Z',
    },
    {
        id: '6',
        userId: 'user-1',
        categoryId: 'cat-6',
        category: 'Redes Sociais',
        title: 'Instagram',
        username: '@alex.dev.br',
        email: 'alex.dev@email.com',
        phone: '',
        password: 'Insta789!',
        url: 'https://instagram.com/alex.dev.br',
        notes: 'Perfil profissional',
        favorite: false,
        createdAt: '2024-04-18T10:00:00Z',
        updatedAt: '2024-04-18T10:00:00Z',
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
        favorite: false,
        createdAt: '2024-07-05T10:00:00Z',
        updatedAt: '2024-07-05T10:00:00Z',
    },
    {
        id: '8',
        userId: 'user-1',
        categoryId: 'cat-4',
        category: 'Streaming',
        title: 'Spotify',
        username: 'alex.ferreira',
        email: 'alex.ferreira@gmail.com',
        phone: '',
        password: 'Spotify456!',
        url: 'https://spotify.com',
        notes: 'Conta premium',
        favorite: false,
        createdAt: '2024-02-14T10:00:00Z',
        updatedAt: '2024-02-14T10:00:00Z',
    },
    {
        id: '9',
        userId: 'user-1',
        categoryId: 'cat-4',
        category: 'Streaming',
        title: 'Spotify',
        username: 'alex.ferreira',
        email: 'alex.ferreira@gmail.com',
        phone: '',
        password: 'Spotify456!',
        url: 'https://spotify.com',
        notes: 'Conta premium',
        favorite: false,
        createdAt: '2024-02-14T10:00:00Z',
        updatedAt: '2024-02-14T10:00:00Z',
    },
    {
        id: '10',
        userId: 'user-1',
        categoryId: 'cat-4',
        category: 'Streaming',
        title: 'Spotify',
        username: 'alex.ferreira',
        email: 'alex.ferreira@gmail.com',
        phone: '',
        password: 'Spotify456!',
        url: 'https://spotify.com',
        notes: 'Conta premium',
        favorite: false,
        createdAt: '2024-02-14T10:00:00Z',
        updatedAt: '2024-02-14T10:00:00Z',
    },
    {
        id: '11',
        userId: 'user-1',
        categoryId: 'cat-4',
        category: 'Streaming',
        title: 'Spotify',
        username: 'alex.ferreira',
        email: 'alex.ferreira@gmail.com',
        phone: '',
        password: 'Spotify456!',
        url: 'https://spotify.com',
        notes: 'Conta premium',
        favorite: false,
        createdAt: '2024-02-14T10:00:00Z',
        updatedAt: '2024-02-14T10:00:00Z',
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

export default function DashboardPage() {
    const [credentials, setCredentials] =
        useState<Credential[]>(credentialsData);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [selectedCredential, setSelectedCredential] =
        useState<Credential | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        console.log('Buscando:', query);
    };

    const handleNewCredential = () => {
        setIsNewModalOpen(true);
    };

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

    const handleNewCredentialSave = (data: NewCredentialData) => {
        console.log('Nova credencial:', data);
        const now = new Date().toISOString();
        const newCredential: Credential = {
            id: String(Date.now()),
            userId: 'user-1',
            categoryId: `cat-${Date.now()}`,
            category: data.category,
            title: data.title,
            username: data.username || data.email || '',
            email: data.email || '',
            phone: '',
            password: data.password,
            url: data.url || '',
            notes: data.notes || '',
            favorite: false,
            createdAt: now,
            updatedAt: now,
        };
        setCredentials((prev) => [newCredential, ...prev]);
        setIsNewModalOpen(false);
    };

    const handleDelete = (id: string) => {
        console.log('Excluir:', id);
        setCredentials((prev) => prev.filter((c) => c.id !== id));
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

    const filteredCredentials = credentials.filter((cred) => {
        const matchesSearch =
            cred.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cred.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cred.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === 'Todas' || cred.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <Header
                variant="search"
                credentialCount={8}
                onSearch={handleSearch}
                onNewCredential={handleNewCredential}
            />

            <div className="p-4 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCredentials.map((cred) => (
                        <CredentialCard
                            key={cred.id}
                            credential={{
                                ...cred,
                                favorite: cred.favorite,
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

                {filteredCredentials.length === 0 && (
                    <div className="text-center py-12">
                        <Key className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
                        <p className="text-foreground/40">
                            Nenhuma credencial encontrada
                        </p>
                    </div>
                )}
            </div>

            <ViewCredentialModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedCredential(null);
                }}
                credential={selectedCredential}
                onEdit={handleEdit}
            />

            <NewCredentialModal
                isOpen={isNewModalOpen}
                onClose={() => setIsNewModalOpen(false)}
                onSave={handleNewCredentialSave}
            />
        </>
    );
}
