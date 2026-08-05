/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { HeartIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Credential } from '@/src/shared/types/credential';
import { formatDateTime } from '@/src/client/utils/formatters/date';
import { useVaultStore } from '@/src/client/store/vault.store';
import { decryptString } from '@/src/shared/crypto/cipher';
import { getCredentialsAction } from '@/src/server/actions/credentials/get-credentials.action';
import Header from '@/src/client/components/layout/header/Header';
import CredentialCard from '@/src/client/components/ui/cards/CredentialCard';
import ViewCredentialModal from '@/src/client/components/layout/modals/credentialsModals/ViewCredentialModal';
import { copyPasswordAction } from '@/src/server/actions/credentials/copy-password.action';
import { toggleFavoriteAction } from '@/src/server/actions/credentials/toggle-favorite.action';
import { deleteCredentialAction } from '@/src/server/actions/credentials/delete-credential.action';
import { useRouter } from 'next/navigation';
import { generateResourceSearchHash } from '@/src/shared/crypto/resource-search';
import { usePagination } from '@/src/client/hooks/usePagination';
import { Pagination } from '@/src/client/components/layout/pagination/Pagination';

export default function FavoritePage() {
    const router = useRouter();
    const [credentialsFavorites, setCredentialsFavorites] = useState<
        Credential[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');

    const [selectedCredential, setSelectedCredential] =
        useState<Credential | null>(null);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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
                    favorite: true,
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

                setCredentialsFavorites(decrypted);
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
        <div className="space-y-6">
            <Header
                variant="favorites"
                credentialCount={credentialsFavorites.length}
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
            />

            <div className="p-4 lg:p-6">
                {isLoading ? (
                    <div className="text-center py-12">Carregando...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {credentialsFavorites.map((credential) => (
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

                        {credentialsFavorites.length === 0 && (
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

                        {/* Paginação */}
                        {!isLoading && credentialsFavorites.length > 0 && (
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
