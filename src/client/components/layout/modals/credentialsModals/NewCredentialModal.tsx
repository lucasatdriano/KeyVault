/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { GlobeIcon, KeyIcon, LockIcon, MailIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

import { getCategoriesAction } from '@/src/server/actions/category/get-categories.action';
import { createCredentialAction } from '@/src/server/actions/credentials/create-credential.action';

import { generateResourceSearchHash } from '@/src/shared/crypto/resource-search';
import { decryptString, encryptString } from '@/src/shared/crypto/cipher';
import { bytesToBase64 } from '@/src/shared/crypto/encoding';
import { generateSalt } from '@/src/shared/crypto/random';
import { CreateCredentialData } from '@/src/shared/types/credential';
import { DecryptedCategory } from '@/src/shared/types/category';

import { validateCredentialForm } from '@/src/client/validators/credential.validator';
import { useVaultStore } from '@/src/client/store/vault.store';
import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import InputSelectForm from '@/src/client/components/ui/inputs/InputSelectForm';
import InputTextAreaForm from '@/src/client/components/ui/inputs/InputTextAreaForm';
import ModalBase from '../ModalBase';

interface NewCredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: () => void;
}

const NewCredentialModal: React.FC<NewCredentialModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<DecryptedCategory[]>([]);
    const vaultKey = useVaultStore((state) => state.vaultKey);

    const [formData, setFormData] = useState<CreateCredentialData>({
        title: '',
        username: '',
        email: '',
        password: '',
        url: '',
        categoryId: '',
        notes: '',
    });
    const [errors, setErrors] = useState({
        title: '',
        username: '',
        email: '',
        password: '',
        url: '',
        categoryId: '',
        notes: '',
    });

    const loadCategories = useCallback(async () => {
        if (!vaultKey) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await getCategoriesAction();

            if (!result.success || !result.data) {
                return;
            }

            const decrypted = await Promise.all(
                result.data.map(async (category) => {
                    const name = await decryptString(
                        {
                            cipherText: category.cipherText,
                            iv: category.iv,
                        },
                        vaultKey,
                    );

                    return {
                        id: category.id,
                        name,
                    };
                }),
            );

            setCategories(decrypted);
        } finally {
            setIsLoading(false);
        }
    }, [vaultKey]);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const handleChange = (field: keyof CreateCredentialData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            username: '',
            email: '',
            password: '',
            url: '',
            categoryId: '',
            notes: '',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!vaultKey) {
            toast.error('Vault Key não encontrada.');
            return;
        }

        const validationErrors = validateCredentialForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors({
                title: validationErrors.title ?? '',
                username: validationErrors.username ?? '',
                email: validationErrors.email ?? '',
                password: validationErrors.password ?? '',
                url: validationErrors.url ?? '',
                categoryId: validationErrors.categoryId ?? '',
                notes: validationErrors.notes ?? '',
            });

            return;
        }

        setErrors({
            title: '',
            username: '',
            email: '',
            password: '',
            url: '',
            categoryId: '',
            notes: '',
        });

        setIsLoading(true);

        try {
            const payload = {
                title: formData.title,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                url: formData.url,
                notes: formData.notes,
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
                toast.error(result.error);
                return;
            }

            toast.success(result.message);

            resetForm();

            onClose();

            onSave?.();
        } catch {
            toast.error('Erro ao criar credencial.');
        } finally {
            setIsLoading(false);
        }
    };

    const categoryOptions = categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title="Nova Credencial"
            icon={<PlusIcon className="w-5 h-5 text-primary" />}
            maxWidth="lg"
            footer={
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button variant="secondary" onClick={onClose} fullWidth>
                        Cancelar
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        loadingText="Salvando..."
                        fullWidth
                    >
                        Salvar
                    </Button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputTextForm
                    label="Título"
                    placeholder="GitHub"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    leftIcon={<KeyIcon className="w-5 h-5" />}
                    error={errors.title}
                    required
                />

                <InputTextForm
                    label="Usuário / E-mail"
                    placeholder="usuario@email.com"
                    value={formData.email || formData.username}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (value.includes('@')) {
                            handleChange('email', value);
                            handleChange('username', '');
                        } else {
                            handleChange('username', value);
                            handleChange('email', '');
                        }
                    }}
                    leftIcon={<MailIcon className="w-5 h-5" />}
                    error={errors.username || errors.email}
                    required
                />

                <InputTextForm
                    label="Senha"
                    type="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    leftIcon={<LockIcon className="w-5 h-5" />}
                    error={errors.password}
                    required
                />

                <InputTextForm
                    label="Website"
                    placeholder="https://exemplo.com"
                    value={formData.url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    leftIcon={<GlobeIcon className="w-5 h-5" />}
                    error={errors.url}
                />

                <InputSelectForm
                    label="Categoria"
                    options={categoryOptions}
                    placeholder="Selecione uma categoria"
                    value={formData.categoryId ?? ''}
                    onChange={(e) => handleChange('categoryId', e.target.value)}
                    error={errors.categoryId}
                />

                <InputTextAreaForm
                    label="Notas"
                    placeholder="Informações adicionais..."
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    error={errors.notes}
                    rows={3}
                />
            </form>
        </ModalBase>
    );
};

export default NewCredentialModal;
