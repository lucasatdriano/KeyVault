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
import NewCredentialModal from '@/src/client/components/layout/modals/credentialsModals/NewCredentialModal';
import ViewCredentialModal from '@/src/client/components/layout/modals/credentialsModals/ViewCredentialModal';
import { copyPasswordAction } from '@/src/server/actions/credentials/copy-password.action';
import { toggleFavoriteAction } from '@/src/server/actions/credentials/toggle-favorite.action';
import { deleteCredentialAction } from '@/src/server/actions/credentials/delete-credential.action';
import { generateResourceSearchHash } from '@/src/shared/crypto/resource-search';
import { usePagination } from '@/src/client/hooks/usePagination';
import { Pagination } from '@/src/client/components/layout/pagination/Pagination';

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

    const pagination = usePagination({
        initialPage: 1,
        initialItemsPerPage: 18,
    });

    const loadCredentials = useCallback(
        async (
            search?: string,
            category?: string,
            page: number = pagination.currentPage,
        ) => {
            if (!vaultKey) {
                return;
            }

            setIsLoading(true);

            try {
                const searchHash =
                    search && vaultKey
                        ? await generateResourceSearchHash(search, vaultKey)
                        : undefined;

                const result = await getCredentialsAction({
                    search: searchHash,
                    categoryId:
                        category && category !== 'Todas' ? category : undefined,
                    page,
                    limit: pagination.itemsPerPage,
                });

                if (!result.success || !result.data) {
                    return;
                }

                pagination.setTotalItems(result.data.total);

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

                        let categoryName = 'Outros';

                        if (credential.category) {
                            categoryName = await decryptString(
                                {
                                    cipherText: credential.category.cipherText,
                                    iv: credential.category.iv,
                                },
                                vaultKey,
                            );
                        }

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

                            category: categoryName,

                            favorite: credential.favorite,

                            createdAt: credential.createdAt.toISOString(),
                            updatedAt: credential.updatedAt.toISOString(),
                        } as Credential;
                    }),
                );

                setCredentials(decrypted);
            } catch (error) {
                console.error(error);
                toast.error('Erro ao carregar credenciais.');
            } finally {
                setIsLoading(false);
            }
        },
        [vaultKey, pagination],
    );

    const handlePageChange = useCallback(
        (page: number) => {
            pagination.goToPage(page);
            loadCredentials(searchQuery, selectedCategory, page);
        },
        [pagination, loadCredentials, searchQuery, selectedCategory],
    );

    useEffect(() => {
        loadCredentials();
    }, [loadCredentials]);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        pagination.resetPagination();
        await loadCredentials(query, selectedCategory, 1);
    };

    const handleFilterChange = async (category: string) => {
        setSelectedCategory(category);
        pagination.resetPagination();
        await loadCredentials(searchQuery, category, 1);
    };

    const handleNewCredential = () => {
        setIsNewModalOpen(true);
    };

    const handleCardClick = (credential: Credential) => {
        setSelectedCredential(credential);
        setIsViewModalOpen(true);
    };

    const handleEdit = async () => {
        await loadCredentials(
            searchQuery,
            selectedCategory,
            pagination.currentPage,
        );
        setIsViewModalOpen(false);
        setSelectedCredential(null);
    };

    const handleNewCredentialSave = async () => {
        await loadCredentials(
            searchQuery,
            selectedCategory,
            pagination.currentPage,
        );
        setIsNewModalOpen(false);
    };

    const handleDelete = async (credential: Credential) => {
        try {
            const result = await deleteCredentialAction(credential.id);

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success(result.message);

            await loadCredentials(
                searchQuery,
                selectedCategory,
                pagination.currentPage,
            );

            if (selectedCredential?.id === credential.id) {
                setIsViewModalOpen(false);
                setSelectedCredential(null);
            }
        } catch {
            toast.error('Erro ao excluir credencial.');
        }
    };

    const handleCopy = async (text: string, credentialId: string) => {
        try {
            await navigator.clipboard.writeText(text);

            const result = await copyPasswordAction(credentialId);

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.info(result.message);
        } catch {
            toast.error('Erro ao copiar credencial.');
        }
    };

    const handleToggleFavorite = async (id: string) => {
        try {
            const result = await toggleFavoriteAction(id);

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success(result.message);

            await loadCredentials(
                searchQuery,
                selectedCategory,
                pagination.currentPage,
            );
        } catch {
            toast.error('Erro ao atualizar favorito.');
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

                        {/* Paginação */}
                        {!isLoading && credentials.length > 0 && (
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                totalItems={pagination.totalItems}
                                itemsPerPage={pagination.itemsPerPage}
                                onPageChange={handlePageChange}
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
