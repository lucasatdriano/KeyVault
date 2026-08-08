'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeartIcon } from 'lucide-react';

import {
    Credential,
    UpdateCredentialData,
} from '@/src/shared/types/credential';

import { useCredentials } from '@/src/client/hooks/credentials/useCredentials';
import { formatDateTime } from '@/src/client/utils/formatters/date';

import Header from '@/src/client/components/layout/header/Header';
import CredentialCard from '@/src/client/components/ui/cards/CredentialCard';
import Pagination from '@/src/client/components/layout/pagination/Pagination';
import ViewCredentialModal from '@/src/client/components/layout/modals/credentialsModals/ViewCredentialModal';

export default function FavoritePage() {
    const router = useRouter();

    const {
        credentials,
        isLoading,
        isUpdating,
        pagination,
        handleSearch,
        handleFilterChange,
        handleCopy,
        handleToggleFavorite,
        handleDelete,
        handleUpdateCredential,
        refresh,
        loadCredentials,
        selectedCategory,
    } = useCredentials({
        initialPage: 1,
        initialItemsPerPage: 18,
        favorite: true,
    });

    const [selectedCredential, setSelectedCredential] =
        useState<Credential | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    useEffect(() => {
        loadCredentials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCardClick = (credential: Credential) => {
        setSelectedCredential(credential);
        setIsViewModalOpen(true);
    };

    const handleEdit = async () => {
        await refresh();
        setIsViewModalOpen(false);
        setSelectedCredential(null);
    };

    const handleUpdateCredentialWrapper = async (
        credential: Credential,
        formData: UpdateCredentialData,
    ) => {
        const result = await handleUpdateCredential(credential, formData);

        if (result.success) {
            if (result.data && selectedCredential?.id === credential.id) {
                setSelectedCredential(result.data);
            }
            return { success: true };
        } else {
            return { success: false, error: result.error };
        }
    };

    const handleDeleteWrapper = async (credential: Credential) => {
        const success = await handleDelete(credential);
        if (success && selectedCredential?.id === credential.id) {
            setIsViewModalOpen(false);
            setSelectedCredential(null);
        }
    };

    return (
        <div className="space-y-6">
            <Header
                variant="favorites"
                credentialCount={credentials.length}
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                selectedCategory={selectedCategory}
            />

            <div className="p-4 lg:p-6">
                {isLoading ? (
                    <div className="text-center py-12">Carregando...</div>
                ) : (
                    <>
                        {isUpdating && (
                            <div className="mb-4 text-sm text-primary">
                                Atualizando credencial...
                            </div>
                        )}

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
                                    onDelete={handleDeleteWrapper}
                                    onCopy={handleCopy}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            ))}
                        </div>

                        {credentials.length === 0 && (
                            <div className="py-16 text-center">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10">
                                    <HeartIcon className="h-10 w-10 text-yellow-500/40" />
                                </div>

                                <h3 className="mb-2 text-lg font-semibold text-foreground">
                                    Nenhum favorito ainda
                                </h3>

                                <p className="mx-auto max-w-sm text-sm text-foreground/40">
                                    Marque suas credenciais mais importantes
                                    como favoritas clicando na estrela ⭐
                                </p>

                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="mt-4 text-sm text-primary hover:underline"
                                >
                                    Ver todas as credenciais
                                </button>
                            </div>
                        )}

                        {!isLoading && credentials.length > 0 && (
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                totalItems={pagination.totalItems}
                                itemsPerPage={pagination.itemsPerPage}
                                onPageChange={pagination.goToPage}
                            />
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
                onCopy={handleCopy}
                onUpdate={handleUpdateCredentialWrapper}
                isUpdating={isUpdating}
            />
        </div>
    );
}
