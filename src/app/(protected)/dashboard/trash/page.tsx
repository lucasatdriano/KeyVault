'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2Icon, AlertCircleIcon } from 'lucide-react';

import { useCredentials } from '@/src/client/hooks/credentials/useCredentials';

import Header from '@/src/client/components/layout/header/Header';
import DeletedCredentialCard from '@/src/client/components/ui/cards/DeletedCredentialCard';
import InfoCard from '@/src/client/components/ui/cards/InfoCard';
import Pagination from '@/src/client/components/layout/pagination/Pagination';

export default function TrashPage() {
    const router = useRouter();

    const {
        credentials: trashItems,
        isLoading,
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        goToPage,
        handleSearch,
        handleRestore,
        loadCredentials,
        selectedCategory,
    } = useCredentials({
        initialPage: 1,
        initialItemsPerPage: 10,
        deleted: true,
    });

    useEffect(() => {
        loadCredentials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRestoreWrapper = async (id: string) => {
        await handleRestore(id);
    };

    return (
        <div className="space-y-6">
            <Header
                variant="trash"
                credentialCount={trashItems.length}
                onSearch={handleSearch}
                selectedCategory={selectedCategory}
            />

            {isLoading ? (
                <div className="py-16 text-center">Carregando...</div>
            ) : (
                <>
                    {trashItems.length > 0 ? (
                        <div className="space-y-3 px-4">
                            {trashItems.map((credential) => (
                                <DeletedCredentialCard
                                    key={credential.id}
                                    credential={credential}
                                    onRestore={handleRestoreWrapper}
                                />
                            ))}

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                onPageChange={goToPage}
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
                                Credenciais excluídas aparecerão aqui por 30
                                dias. Você poderá restaurá-las a qualquer
                                momento.
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
                                Credenciais excluídas permanecem disponíveis por
                                30 dias antes da remoção definitiva.
                            </>
                        </InfoCard>
                    )}
                </>
            )}
        </div>
    );
}
