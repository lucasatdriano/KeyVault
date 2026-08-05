/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2Icon, AlertCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Credential } from '@/src/shared/types/credential';
import { decryptString } from '@/src/shared/crypto/cipher';

import { useVaultStore } from '@/src/client/store/vault.store';

import { getCredentialsAction } from '@/src/server/actions/credentials/get-credentials.action';
import { restoreCredentialAction } from '@/src/server/actions/credentials/restore-credential.action';

import Header from '@/src/client/components/layout/header/Header';
import DeletedCredentialCard from '@/src/client/components/ui/cards/DeletedCredentialCard';
import InfoCard from '@/src/client/components/ui/cards/InfoCard';
import { generateResourceSearchHash } from '@/src/shared/crypto/resource-search';
import { usePagination } from '@/src/client/hooks/usePagination';
import { Pagination } from '@/src/client/components/layout/pagination/Pagination';

export default function TrashPage() {
    const router = useRouter();

    const vaultKey = useVaultStore((state) => state.vaultKey);

    const [trashItems, setTrashItems] = useState<Credential[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');

    const pagination = usePagination({
        initialPage: 1,
        initialItemsPerPage: 10,
    });

    const loadTrash = useCallback(
        async (search?: string, page: number = pagination.currentPage) => {
            if (!vaultKey) {
                return;
            }

            setLoading(true);

            try {
                const searchHash =
                    search && vaultKey
                        ? await generateResourceSearchHash(search, vaultKey)
                        : undefined;

                const result = await getCredentialsAction({
                    deleted: true,
                    search: searchHash,
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

                            deletedAt: credential.deletedAt?.toISOString(),
                        } as Credential;
                    }),
                );

                setTrashItems(decrypted);
            } catch (error) {
                console.error(error);
                toast.error('Erro ao carregar a lixeira.');
            } finally {
                setLoading(false);
            }
        },
        [vaultKey, pagination],
    );

    const handlePageChange = useCallback(
        (page: number) => {
            pagination.goToPage(page);
            loadTrash(searchQuery, page);
        },
        [pagination, loadTrash, searchQuery],
    );

    useEffect(() => {
        loadTrash();
    }, [loadTrash]);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        pagination.resetPagination();
        await loadTrash(query, 1);
    };

    const handleRestore = async (id: string) => {
        const result = await restoreCredentialAction(id);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        toast.success(result.message);

        await loadTrash(searchQuery, pagination.currentPage);
    };

    return (
        <div className="space-y-6">
            <Header
                variant="trash"
                credentialCount={trashItems.length}
                onSearch={handleSearch}
            />

            {loading ? (
                <div className="py-16 text-center">Carregando...</div>
            ) : trashItems.length > 0 ? (
                <div className="space-y-3 px-4">
                    {trashItems.map((credential) => (
                        <DeletedCredentialCard
                            key={credential.id}
                            credential={credential}
                            onRestore={handleRestore}
                        />
                    ))}

                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        itemsPerPage={pagination.itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            ) : (
                <div className="py-16 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-error/10">
                        <Trash2Icon className="h-10 w-10 text-error/40" />
                    </div>

                    <h3 className="mb-2 text-lg font-semibold">
                        Lixeira vazia
                    </h3>

                    <p className="mx-auto max-w-sm text-sm text-foreground/40">
                        Credenciais excluídas aparecerão aqui por 30 dias. Você
                        poderá restaurá-las a qualquer momento.
                    </p>

                    <button
                        onClick={() => router.push('/dashboard')}
                        className="mt-4 text-sm text-primary hover:underline"
                    >
                        Voltar para o dashboard
                    </button>
                </div>
            )}

            {trashItems.length > 0 && (
                <InfoCard
                    icon={AlertCircleIcon}
                    footer={
                        <>
                            {trashItems.length}{' '}
                            {trashItems.length === 1
                                ? 'credencial'
                                : 'credenciais'}{' '}
                            na lixeira
                        </>
                    }
                >
                    <>
                        <span className="font-medium text-foreground/80">
                            Retenção de 30 dias:
                        </span>{' '}
                        Credenciais excluídas permanecem disponíveis por 30 dias
                        antes da remoção definitiva.
                    </>
                </InfoCard>
            )}
        </div>
    );
}
