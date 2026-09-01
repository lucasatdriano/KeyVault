import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { createCredentialAction } from '@/src/server/actions/credentials/create-credential.action';
import { updateCredentialAction } from '@/src/server/actions/credentials/update-credential.action';
import { deleteCredentialAction } from '@/src/server/actions/credentials/delete-credential.action';
import { restoreCredentialAction } from '@/src/server/actions/credentials/restore-credential.action';
import { toggleFavoriteAction } from '@/src/server/actions/credentials/toggle-favorite.action';
import { copyPasswordAction } from '@/src/server/actions/credentials/copy-password.action';

import { generateSalt } from '@/src/shared/crypto/random';
import { encryptString } from '@/src/shared/crypto/cipher';
import { bytesToBase64 } from '@/src/shared/crypto/encoding';
import { generateResourceSearchHash } from '@/src/shared/crypto/resource-search';
import { Credential, CredentialFormData } from '@/src/shared/types/credential';

import { useCredentialsStore } from '@/src/client/store/credential.store';
import { useVaultStore } from '@/src/client/store/vault.store';

interface CredentialResult {
    success: boolean;
    error?: string;
    data?: Credential;
}

export function useCredentialsActions() {
    const vaultKey = useVaultStore((state) => state.vaultKey);

    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        toggleFavorite: toggleFavoriteStore,
        deleteCredential: deleteCredentialStore,
        restoreCredential: restoreCredentialStore,
        addCredential: addCredentialStore,
        updateCredential: updateCredentialStore,
    } = useCredentialsStore();

    const handleCopy = useCallback(
        async (text: string, credentialId: string) => {
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
        },
        [],
    );

    const handleToggleFavorite = useCallback(
        async (
            id: string,
            setLocalCredentials: (
                fn: (prev: Credential[]) => Credential[],
            ) => void,
        ) => {
            try {
                toggleFavoriteStore(id);

                setLocalCredentials((prev) =>
                    prev.map((credential) =>
                        credential.id === id
                            ? { ...credential, favorite: !credential.favorite }
                            : credential,
                    ),
                );

                const result = await toggleFavoriteAction(id);

                if (!result.success) {
                    toggleFavoriteStore(id);
                    setLocalCredentials((prev) =>
                        prev.map((credential) =>
                            credential.id === id
                                ? {
                                      ...credential,
                                      favorite: !credential.favorite,
                                  }
                                : credential,
                        ),
                    );
                    toast.error(result.error);
                    return;
                }

                toast.success(result.message);
            } catch {
                toggleFavoriteStore(id);
                setLocalCredentials((prev) =>
                    prev.map((credential) =>
                        credential.id === id
                            ? { ...credential, favorite: !credential.favorite }
                            : credential,
                    ),
                );
                toast.error('Erro ao atualizar favorito.');
            }
        },
        [toggleFavoriteStore],
    );

    const handleCreateCredential = useCallback(
        async (
            formData: CredentialFormData,
            options: {
                refresh: () => void;
                incrementTotalItems: () => void;
                setLocalCredentials: (
                    fn: (prev: Credential[]) => Credential[],
                ) => void;
            },
        ): Promise<CredentialResult> => {
            if (!vaultKey) {
                return { success: false, error: 'Vault Key não encontrada.' };
            }

            setIsCreating(true);

            try {
                const payload = {
                    title: formData.title,
                    username: formData.username || '',
                    email: formData.email || '',
                    password: formData.password,
                    url: formData.url || '',
                    notes: formData.notes || '',
                };

                const encrypted = await encryptString(
                    JSON.stringify(payload),
                    vaultKey,
                );

                const resourceSearchHash = await generateResourceSearchHash(
                    formData.title,
                    vaultKey,
                );

                const salt = bytesToBase64(generateSalt());

                const result = await createCredentialAction({
                    categoryId: formData.categoryId || null,
                    cipherText: encrypted.cipherText,
                    iv: encrypted.iv,
                    salt,
                    resourceSearchHash,
                    version: 1,
                    algorithm: 'AES-256-GCM',
                    favorite: false,
                });

                if (!result.success) {
                    return { success: false, error: result.error };
                }

                const now = new Date().toISOString();

                const tempCredential: Credential = {
                    id: crypto.randomUUID(),
                    userId: '',
                    categoryId: formData.categoryId || null,
                    category: 'Carregando...',
                    title: formData.title,
                    username: formData.username || '',
                    email: formData.email || '',
                    password: formData.password,
                    url: formData.url || '',
                    notes: formData.notes || '',
                    favorite: false,
                    createdAt: now,
                    updatedAt: now,
                    deletedAt: '',
                };

                addCredentialStore(tempCredential);
                options.setLocalCredentials((prev) => [
                    tempCredential,
                    ...prev,
                ]);
                options.incrementTotalItems();

                setTimeout(async () => {
                    await options.refresh();
                }, 500);

                return { success: true, data: tempCredential };
            } catch (error) {
                console.error('Erro ao criar credencial:', error);
                return { success: false, error: 'Erro ao criar credencial.' };
            } finally {
                setIsCreating(false);
            }
        },
        [vaultKey, addCredentialStore],
    );

    const handleUpdateCredential = useCallback(
        async (
            credential: Credential,
            formData: CredentialFormData,
            options: {
                refresh: () => void;
                setLocalCredentials: (
                    fn: (prev: Credential[]) => Credential[],
                ) => void;
            },
        ): Promise<CredentialResult> => {
            if (!vaultKey) {
                return { success: false, error: 'Vault Key não encontrada.' };
            }

            setIsUpdating(true);

            try {
                const payload = {
                    title: formData.title,
                    username: formData.username || '',
                    email: formData.email || '',
                    password: formData.password,
                    url: formData.url || '',
                    notes: formData.notes || '',
                };

                const encrypted = await encryptString(
                    JSON.stringify(payload),
                    vaultKey,
                );

                let resourceSearchHash: string | null = null;

                if (formData.title !== credential.title) {
                    resourceSearchHash = await generateResourceSearchHash(
                        formData.title,
                        vaultKey,
                    );
                }

                const salt = bytesToBase64(generateSalt());

                const result = await updateCredentialAction({
                    id: credential.id,
                    categoryId: formData.categoryId || null,
                    cipherText: encrypted.cipherText,
                    iv: encrypted.iv,
                    salt,
                    resourceSearchHash,
                    version: 1,
                    algorithm: 'AES-256-GCM',
                    favorite: credential.favorite,
                });

                if (!result.success) {
                    return { success: false, error: result.error };
                }

                const now = new Date().toISOString();

                const updatedCredential: Credential = {
                    ...credential,
                    title: formData.title,
                    categoryId: formData.categoryId || null,
                    username: formData.username || '',
                    email: formData.email || '',
                    password: formData.password,
                    url: formData.url || '',
                    notes: formData.notes || '',
                    updatedAt: now,
                };

                updateCredentialStore(credential.id, updatedCredential);

                options.setLocalCredentials((prev) =>
                    prev.map((current) =>
                        current.id === credential.id
                            ? updatedCredential
                            : current,
                    ),
                );

                setTimeout(async () => {
                    await options.refresh();
                }, 500);

                return { success: true, data: updatedCredential };
            } catch (error) {
                console.error('Erro ao atualizar credencial:', error);
                return {
                    success: false,
                    error: 'Erro ao atualizar credencial.',
                };
            } finally {
                setIsUpdating(false);
            }
        },
        [vaultKey, updateCredentialStore],
    );

    const handleDelete = useCallback(
        async (
            credential: Credential,
            options: {
                refresh: () => void;
                decrementTotalItems: () => void;
                setLocalCredentials: (
                    fn: (prev: Credential[]) => Credential[],
                ) => void;
            },
        ) => {
            try {
                deleteCredentialStore(credential.id);

                options.setLocalCredentials((prev) =>
                    prev.filter((current) => current.id !== credential.id),
                );

                options.decrementTotalItems();

                const result = await deleteCredentialAction(credential.id);

                if (!result.success) {
                    await options.refresh();
                    toast.error(result.error);
                    return false;
                }

                toast.success(result.message);
                return true;
            } catch {
                await options.refresh();
                toast.error('Erro ao excluir credencial.');
                return false;
            }
        },
        [deleteCredentialStore],
    );

    const handleRestore = useCallback(
        async (
            id: string,
            options: {
                refresh: () => void;
                invalidateCache: () => void;
                loadCredentials: (
                    search?: string,
                    category?: string,
                    page?: number,
                ) => void;
                decrementTotalItems: () => void;
                setLocalCredentials: (
                    fn: (prev: Credential[]) => Credential[],
                ) => void;
                deleted: boolean;
                searchQuery: string;
                selectedCategory: string;
                currentPage: number;
            },
        ) => {
            try {
                restoreCredentialStore(id);

                if (options.deleted) {
                    options.setLocalCredentials((prev) =>
                        prev.filter((credential) => credential.id !== id),
                    );
                    options.decrementTotalItems();
                }

                const result = await restoreCredentialAction(id);

                if (!result.success) {
                    deleteCredentialStore(id);
                    await options.refresh();
                    toast.error(result.error);
                    return false;
                }

                toast.success(result.message);

                setTimeout(async () => {
                    options.invalidateCache();
                    await options.loadCredentials(
                        options.searchQuery,
                        options.selectedCategory,
                        options.currentPage,
                    );
                }, 300);

                return true;
            } catch {
                deleteCredentialStore(id);
                await options.refresh();
                toast.error('Erro ao restaurar credencial.');
                return false;
            }
        },
        [restoreCredentialStore, deleteCredentialStore],
    );

    return {
        isCreating,
        isUpdating,
        handleCopy,
        handleToggleFavorite,
        handleCreateCredential,
        handleUpdateCredential,
        handleDelete,
        handleRestore,
    };
}
