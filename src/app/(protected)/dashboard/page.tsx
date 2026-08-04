/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { KeyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Credential } from '@/src/shared/types/credential';
import { formatDateTime } from '@/src/client/utils/formatters/date';
import { useVaultStore } from '@/src/client/store/vault.store';
import { decryptString } from '@/src/shared/crypto/cipher';
import { getCredentialsAction } from '@/src/server/actions/credentials/get-credentials.action';
import Header from '@/src/client/components/layout/header/Header';
import CredentialCard from '@/src/client/components/ui/cards/CredentialCard';
import ViewCredentialModal from '@/src/client/components/layout/modals/credentialsModals/ViewCredentialModal';
import NewCredentialModal from '@/src/client/components/layout/modals/credentialsModals/NewCredentialModal';

export default function DashboardPage() {
    const [credentials, setCredentials] = useState<Credential[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');

    const [selectedCredential, setSelectedCredential] =
        useState<Credential | null>(null);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    const vaultKey = useVaultStore((state) => state.vaultKey);

    const loadCredentials = useCallback(
        async (search?: string, category?: string) => {
            if (!vaultKey) {
                return;
            }

            setIsLoading(true);

            try {
                const result = await getCredentialsAction({
                    search,
                    categoryId:
                        category && category !== 'Todas' ? category : undefined,
                });

                if (!result.success || !result.data) {
                    return;
                }

                const decrypted = await Promise.all(
                    result.data.data.map(async (credential) => {
                        const json = await decryptString(
                            {
                                cipherText: credential.cipherText,
                                iv: credential.iv,
                            },
                            vaultKey,
                        );

                        const data = JSON.parse(json);

                        return {
                            id: credential.id,
                            userId: credential.userId,
                            categoryId: credential.categoryId,

                            title: data.title,
                            username: data.username,
                            email: data.email,
                            password: data.password,
                            url: data.url,
                            notes: data.notes,

                            category: data.category,

                            favorite: credential.favorite,

                            createdAt: credential.createdAt.toISOString(),
                            updatedAt: credential.updatedAt.toISOString(),
                        } as Credential;
                    }),
                );

                setCredentials(decrypted);
            } finally {
                setIsLoading(false);
            }
        },
        [vaultKey],
    );

    useEffect(() => {
        loadCredentials();
    }, [loadCredentials]);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);

        await loadCredentials(query, selectedCategory);
    };

    const handleFilterChange = async (category: string) => {
        setSelectedCategory(category);

        await loadCredentials(searchQuery, category);
    };

    const handleNewCredential = () => {
        setIsNewModalOpen(true);
    };

    const handleCardClick = (credential: Credential) => {
        setSelectedCredential(credential);
        setIsViewModalOpen(true);
    };

    const handleEdit = async () => {
        await loadCredentials(searchQuery, selectedCategory);

        setIsViewModalOpen(false);
        setSelectedCredential(null);
    };

    const handleNewCredentialSave = async () => {
        await loadCredentials(searchQuery, selectedCategory);

        setIsNewModalOpen(false);
    };

    const handleDelete = async () => {
        await loadCredentials(searchQuery, selectedCategory);

        setIsViewModalOpen(false);
        setSelectedCredential(null);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info('Copiado para a área de transferência');
    };

    const handleToggleFavorite = async () => {
        await loadCredentials(searchQuery, selectedCategory);
    };

    return (
        <>
            <Header
                variant="search"
                credentialCount={credentials.length}
                onSearch={handleSearch}
                onNewCredential={handleNewCredential}
                onFilterChange={handleFilterChange}
            />

            <div className="p-4 lg:p-6">
                {isLoading ? (
                    <div className="text-center py-12">Carregando...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {credentials.map((credential) => (
                                <CredentialCard
                                    key={credential.id}
                                    credential={{
                                        ...credential,
                                        createdAt: formatDateTime(
                                            credential.createdAt,
                                        ),
                                    }}
                                    onClick={() => handleCardClick(credential)}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onCopy={handleCopy}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            ))}
                        </div>

                        {credentials.length === 0 && (
                            <div className="py-12 text-center">
                                <KeyIcon className="mx-auto mb-3 h-12 w-12 text-foreground/20" />

                                <p className="text-foreground/40">
                                    Nenhuma credencial encontrada
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <ViewCredentialModal
                isOpen={isViewModalOpen}
                credential={selectedCredential}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedCredential(null);
                }}
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
