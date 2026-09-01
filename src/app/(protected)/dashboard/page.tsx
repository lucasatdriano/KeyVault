'use client';

import { useState } from 'react';
import { KeyIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Credential, CredentialFormData } from '@/src/shared/types/credential';

import { useCredentials } from '@/src/client/hooks/credentials/useCredentials';
import { formatDateTime } from '@/src/client/utils/formatters/date';

import CredentialCard from '@/src/client/components/ui/cards/CredentialCard';
import Header from '@/src/client/components/layout/header/Header';
import Pagination from '@/src/client/components/layout/pagination/Pagination';
import NewCredentialModal from '@/src/client/components/layout/modals/credentialsModals/NewCredentialModal';
import ViewCredentialModal from '@/src/client/components/layout/modals/credentialsModals/ViewCredentialModal';

export default function DashboardPage() {
    const {
        credentials,
        isLoading,
        isCreating,
        isUpdating,
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        goToPage,
        handleSearch,
        handleFilterChange,
        handleCopy,
        handleToggleFavorite,
        handleDelete,
        handleCreateCredential,
        handleUpdateCredential,
        refresh,
        selectedCategory,
    } = useCredentials({
        initialPage: 1,
        initialItemsPerPage: 18,
    });

    const [selectedCredential, setSelectedCredential] =
        useState<Credential | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

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

    const handleNewCredentialSave = async (
        credentialData: CredentialFormData,
    ) => {
        const result = await handleCreateCredential(credentialData);

        if (!result.success) {
            toast.error(result.error || 'Erro ao criar credencial.');

            return;
        }

        setIsNewModalOpen(false);

        toast.success('Credencial criada com sucesso!');
    };

    const handleUpdateCredentialWrapper = async (
        credential: Credential,
        formData: CredentialFormData,
    ) => {
        const result = await handleUpdateCredential(credential, formData);

        if (!result.success) {
            toast.error(result.error || 'Erro ao atualizar credencial.');

            return;
        }

        if (result.data && selectedCredential?.id === credential.id) {
            setSelectedCredential(result.data);
        }

        setIsViewModalOpen(false);

        toast.success('Credencial atualizada com sucesso!');
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
            <div className="space-y-4">
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
                            {isCreating && (
                                <div className="mb-4 text-sm text-primary">
                                    Criando credencial...
                                </div>
                            )}

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
                                        onClick={() =>
                                            handleCardClick(credential)
                                        }
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
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={totalItems}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={goToPage}
                                />
                            )}
                        </>
                    )}
                </div>
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

            <NewCredentialModal
                isOpen={isNewModalOpen}
                onClose={() => setIsNewModalOpen(false)}
                onSave={handleNewCredentialSave}
                isLoading={isCreating}
            />
        </>
    );
}
