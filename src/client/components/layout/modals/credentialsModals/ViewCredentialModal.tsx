/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import {
    KeyIcon,
    MailIcon,
    GlobeIcon,
    FileTextIcon,
    CalendarIcon,
    EditIcon,
    CopyIcon,
    EyeIcon,
    EyeOffIcon,
    ShieldIcon,
    LockIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { Credential, CredentialFormData } from '@/src/shared/types/credential';

import { getInitials } from '@/src/client/utils/credentials/credential-avatar';
import {
    getCategoryBadgeColor,
    getCategoryColor,
} from '@/src/client/utils/credentials/credential-category';

import { formatDateTime } from '@/src/client/utils/formatters/date';
import { useCategories } from '@/src/client/hooks/categories/useCategories';
import { validateCredentialForm } from '@/src/client/validators/credential.validator';
import InputTextForm from '@/src/client/components/ui/inputs/InputTextForm';
import InputSelectForm from '@/src/client/components/ui/inputs/InputSelectForm';
import InputTextAreaForm from '@/src/client/components/ui/inputs/InputTextAreaForm';
import Button from '@/src/client/components/ui/buttons/Button';
import ModalBase from '../ModalBase';
import { hasValidationErrors, ValidationErrors } from '@/src/client/validators';

interface ViewCredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
    credential: Credential | null;
    onEdit?: () => void;
    onCopy?: (text: string, credentialId: string) => void;
    onUpdate?: (
        credential: Credential,
        formData: CredentialFormData,
    ) => Promise<void>;
    isUpdating?: boolean;
}

export default function ViewCredentialModal({
    isOpen,
    onClose,
    credential,
    onEdit,
    onCopy,
    onUpdate,
    isUpdating = false,
}: ViewCredentialModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { isLoading: isLoadingCategories, getCategorySelectOptions } =
        useCategories({
            autoLoad: isEditing,
        });

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
        categoryId: '',
        username: '',
        email: '',
        password: '',
        url: '',
        notes: '',
    });

    useEffect(() => {
        if (credential) {
            setFormData({
                title: credential.title,
                categoryId: credential.categoryId || '',
                username: credential.username || '',
                email: credential.email || '',
                password: credential.password,
                url: credential.url || '',
                notes: credential.notes || '',
            });
        }

        setErrors({
            title: '',
            categoryId: '',
            username: '',
            email: '',
            password: '',
            url: '',
            notes: '',
        });
    }, [credential]);

    if (!credential || !formData) {
        return null;
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        onCopy?.(text, credential.id);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateCredentialForm(formData);

        setErrors({
            title: validationErrors.title ?? '',
            categoryId: validationErrors.categoryId ?? '',
            username: validationErrors.username ?? '',
            email: validationErrors.email ?? '',
            password: validationErrors.password ?? '',
            url: validationErrors.url ?? '',
            notes: validationErrors.notes ?? '',
        });

        if (hasValidationErrors(validationErrors)) {
            return;
        }

        try {
            await onUpdate?.(credential, formData);

            onEdit?.();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar credencial.');
        }
    };

    const handleChange = (field: keyof CredentialFormData, value: string) => {
        if (!formData) return;

        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const categoryOptions = [
        { value: 'Outros', label: 'Outros' },
        ...getCategorySelectOptions(),
    ];

    const handleCancelEdit = () => {
        setIsEditing(false);

        setFormData({
            title: credential.title,
            categoryId: credential.categoryId || '',
            username: credential.username || '',
            email: credential.email || '',
            password: credential.password,
            url: credential.url || '',
            notes: credential.notes || '',
        });

        setErrors({
            title: '',
            categoryId: '',
            username: '',
            email: '',
            password: '',
            url: '',
            notes: '',
        });
    };

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Editar Credencial' : 'Credencial'}
            icon={
                isEditing ? (
                    <EditIcon className="h-5 w-5 text-primary" />
                ) : (
                    <ShieldIcon className="h-5 w-5 text-primary" />
                )
            }
            maxWidth="lg"
            footer={
                <div className="flex flex-col gap-3 sm:flex-row">
                    {isEditing ? (
                        <>
                            <Button
                                onClick={handleCancelEdit}
                                variant="secondary"
                                fullWidth
                                disabled={isUpdating}
                            >
                                Cancelar
                            </Button>

                            <Button
                                onClick={handleSave}
                                isLoading={isUpdating}
                                loadingText="Salvando..."
                                fullWidth
                                disabled={isLoadingCategories}
                            >
                                Salvar alterações
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={onClose}
                                variant="secondary"
                                fullWidth
                            >
                                Fechar
                            </Button>

                            <Button
                                onClick={() => setIsEditing(true)}
                                leftIcon={<EditIcon className="h-5 w-5" />}
                                fullWidth
                            >
                                Editar
                            </Button>
                        </>
                    )}
                </div>
            }
        >
            {isEditing ? (
                <div className="space-y-4">
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
                    />

                    <InputTextForm
                        label="Senha"
                        type="password"
                        placeholder="********"
                        value={formData.password}
                        onChange={(e) =>
                            handleChange('password', e.target.value)
                        }
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
                        value={formData.categoryId!}
                        onChange={(e) =>
                            handleChange('categoryId', e.target.value)
                        }
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
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <div
                            className={`
                                flex h-16 w-16 items-center justify-center
                                rounded-2xl
                                bg-linear-to-br ${getCategoryColor(
                                    credential.category,
                                )}
                                shadow-lg shadow-primary/10
                            `}
                        >
                            <span className="text-xl font-bold text-white">
                                {getInitials(credential.title)}
                            </span>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-foreground">
                                {credential.title}
                            </h3>

                            <span
                                className={`
                                    mt-1 inline-block rounded-full
                                    border px-3 py-1 text-xs font-medium
                                    ${getCategoryBadgeColor(
                                        credential.category,
                                    )}
                                `}
                            >
                                {credential.category}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {(credential.email || credential.username) && (
                            <div className="flex items-start gap-3">
                                <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-foreground/30" />

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">
                                        Usuário / E-mail
                                    </p>

                                    <p className="font-medium text-foreground">
                                        {credential.email ||
                                            credential.username}
                                    </p>
                                </div>
                            </div>
                        )}

                        {credential.password && (
                            <div className="flex items-start gap-3">
                                <KeyIcon className="mt-0.5 h-5 w-5 shrink-0 text-foreground/30" />

                                <div className="flex-1">
                                    <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">
                                        Senha
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-medium text-foreground">
                                            {showPassword
                                                ? credential.password
                                                : '••••••••••'}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="rounded p-1 text-foreground/30 transition-colors hover:bg-white/5 hover:text-foreground/60"
                                        >
                                            {showPassword ? (
                                                <EyeOffIcon className="h-4 w-4" />
                                            ) : (
                                                <EyeIcon className="h-4 w-4" />
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCopy(credential.password)
                                            }
                                            className="rounded p-1 text-foreground/30 transition-colors hover:bg-white/5 hover:text-foreground/60"
                                        >
                                            <CopyIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {credential.url && (
                            <div className="flex items-start gap-3">
                                <GlobeIcon className="mt-0.5 h-5 w-5 shrink-0 text-foreground/30" />

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">
                                        Website
                                    </p>

                                    <a
                                        href={credential.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-primary hover:underline"
                                    >
                                        {credential.url}
                                    </a>
                                </div>
                            </div>
                        )}

                        {credential.notes && (
                            <div className="flex items-start gap-3">
                                <FileTextIcon className="mt-0.5 h-5 w-5 shrink-0 text-foreground/30" />

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">
                                        Notas
                                    </p>

                                    <p className="text-sm leading-relaxed text-foreground/70">
                                        {credential.notes}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-white/10 pt-4">
                        <div className="flex flex-col gap-2 text-xs text-foreground/40 sm:flex-row">
                            <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3.5 w-3.5" />

                                <span>
                                    Criado em{' '}
                                    {formatDateTime(credential.createdAt)}
                                </span>
                            </div>

                            {credential.updatedAt &&
                                credential.updatedAt !==
                                    credential.createdAt && (
                                    <div className="flex items-center gap-1">
                                        <CalendarIcon className="h-3.5 w-3.5" />

                                        <span>
                                            Alterado em{' '}
                                            {formatDateTime(
                                                credential.updatedAt,
                                            )}
                                        </span>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            )}
        </ModalBase>
    );
}
