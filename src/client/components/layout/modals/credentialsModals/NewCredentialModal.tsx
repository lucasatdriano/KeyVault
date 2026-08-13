'use client';

import { useState } from 'react';
import { GlobeIcon, KeyIcon, LockIcon, MailIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

import { CredentialFormData } from '@/src/shared/types/credential';

import { validateCredentialForm } from '@/src/client/validators/credential.validator';
import { useCategories } from '@/src/client/hooks/categories/useCategories';
import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import InputSelectForm from '@/src/client/components/ui/inputs/InputSelectForm';
import InputTextAreaForm from '@/src/client/components/ui/inputs/InputTextAreaForm';
import ModalBase from '../ModalBase';
import { hasValidationErrors, ValidationErrors } from '@/src/client/validators';

interface NewCredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: CredentialFormData) => Promise<void>;
    isLoading?: boolean;
}

export default function NewCredentialModal({
    isOpen,
    onClose,
    onSave,
    isLoading = false,
}: NewCredentialModalProps) {
    const { categories, isLoading: isLoadingCategories } = useCategories();

    const [formData, setFormData] = useState<CredentialFormData>({
        title: '',
        username: '',
        email: '',
        password: '',
        url: '',
        categoryId: '',
        notes: '',
    });

    const [errors, setErrors] = useState<ValidationErrors<CredentialFormData>>({
        title: '',
        username: '',
        email: '',
        password: '',
        url: '',
        categoryId: '',
        notes: '',
    });

    const handleChange = (field: keyof CredentialFormData, value: string) => {
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

        setErrors({
            title: '',
            username: '',
            email: '',
            password: '',
            url: '',
            categoryId: '',
            notes: '',
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateCredentialForm(formData);

        if (hasValidationErrors(validationErrors)) {
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

        try {
            await onSave?.(formData);

            resetForm();
            onClose();
        } catch {
            toast.error('Erro ao criar credencial.');
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={handleClose}
            title="Nova Credencial"
            icon={<PlusIcon className="h-5 w-5 text-primary" />}
            maxWidth="lg"
            footer={
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        fullWidth
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>

                    <Button
                        onClick={handleSave}
                        isLoading={isLoading}
                        loadingText="Salvando..."
                        fullWidth
                        disabled={isLoadingCategories}
                    >
                        Salvar
                    </Button>
                </div>
            }
        >
            <form onSubmit={handleSave} className="space-y-4">
                <InputTextForm
                    label="Título"
                    placeholder="GitHub"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    leftIcon={<KeyIcon className="h-5 w-5" />}
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
                    leftIcon={<MailIcon className="h-5 w-5" />}
                    error={errors.username || errors.email}
                    required
                />

                <InputTextForm
                    label="Senha"
                    type="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    leftIcon={<LockIcon className="h-5 w-5" />}
                    error={errors.password}
                    required
                />

                <InputTextForm
                    label="Website"
                    placeholder="https://exemplo.com"
                    value={formData.url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    leftIcon={<GlobeIcon className="h-5 w-5" />}
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
}
