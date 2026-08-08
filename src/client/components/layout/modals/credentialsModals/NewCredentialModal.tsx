'use client';

import React, { useEffect, useState } from 'react';
import { GlobeIcon, KeyIcon, LockIcon, MailIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

import { CreateCredentialData } from '@/src/shared/types/credential';

import { validateCredentialForm } from '@/src/client/validators/credential.validator';
import Button from '@/src/client/components/ui/buttons/Button';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import InputSelectForm from '@/src/client/components/ui/inputs/InputSelectForm';
import InputTextAreaForm from '@/src/client/components/ui/inputs/InputTextAreaForm';
import ModalBase from '../ModalBase';
import { useCategories } from '@/src/client/hooks/categories/useCategories';

interface NewCredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: CreateCredentialData) => Promise<void>;
    isLoading?: boolean;
}

const NewCredentialModal: React.FC<NewCredentialModalProps> = ({
    isOpen,
    onClose,
    onSave,
    isLoading = false,
}) => {
    const {
        categories,
        isLoading: isLoadingCategories,
        loadCategories,
    } = useCategories({
        autoLoad: false,
    });

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

    useEffect(() => {
        if (isOpen) {
            loadCategories();
        }
    }, [isOpen, loadCategories]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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

    const categoryOptions = categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={handleClose}
            title="Nova Credencial"
            icon={<PlusIcon className="w-5 h-5 text-primary" />}
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
                        onClick={handleSubmit}
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
