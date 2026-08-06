'use client';

import { useEffect, useState } from 'react';
import { KeyIcon } from 'lucide-react';

import { Credential } from '@/src/shared/types/credential';

import { useCredentials } from '@/src/client/hooks/useCredentials';
import { formatDateTime } from '@/src/client/utils/formatters/date';

import Header from '@/src/client/components/layout/header/Header';
import CredentialCard from '@/src/client/components/ui/cards/CredentialCard';
import Pagination from '@/src/client/components/layout/pagination/Pagination';
import NewCredentialModal from '@/src/client/components/layout/modals/credentialsModals/NewCredentialModal';
import ViewCredentialModal from '@/src/client/components/layout/modals/credentialsModals/ViewCredentialModal';

export default function DashboardPage() {
    const {
        credentials,
        isLoading,
        pagination,
        handleSearch,
        handleFilterChange,
        handleCopy,
        handleToggleFavorite,
        handleDelete,
        refresh,
        loadCredentials,
        selectedCategory,
    } = useCredentials({
        initialPage: 1,
        initialItemsPerPage: 18,
    });

    const [selectedCredential, setSelectedCredential] =
        useState<Credential | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    useEffect(() => {
        loadCredentials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNewCredential = () => {
        setIsNewModalOpen(true);
    };

    const handleCardClick = (credential: Credential) => {
        setSelectedCredential(credential);
        setIsViewModalOpen(true);
    };

    const handleEdit = async () => {
        await refresh();
        setIsViewModalOpen(false);
        setSelectedCredential(null);
    };

    const handleNewCredentialSave = async () => {
        await refresh();
        setIsNewModalOpen(false);
    };

    const handleDeleteWrapper = async (credential: Credential) => {
        const success = await handleDelete(credential);
        if (success && selectedCredential?.id === credential.id) {
            setIsViewModalOpen(false);
            setSelectedCredential(null);
        }
    };

    return (
        <>
            <Header
                variant="search"
                credentialCount={credentials.length}
                onSearch={handleSearch}
                onNewCredential={handleNewCredential}
                onFilterChange={handleFilterChange}
                selectedCategory={selectedCategory}
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
                                    onDelete={handleDeleteWrapper}
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
            />

            <NewCredentialModal
                isOpen={isNewModalOpen}
                onClose={() => setIsNewModalOpen(false)}
                onSave={handleNewCredentialSave}
            />
        </>
    );
}
