/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { SearchIcon, PlusIcon, LucideIcon } from 'lucide-react';

import Button from '../../ui/buttons/Button';
import InputTextForm from '../../ui/inputs/InputTextForm';
import InputSelectForm from '../../ui/inputs/InputSelectForm';

interface HeaderSearchProps {
    icon: LucideIcon;
    iconClass: string;
    iconBgColor: string;
    title: string;
    subtitle: string;
    onSearch?: (query: string) => void;
    onFilterChange?: (value: string) => void;
    onNewCredential?: () => void;
    showNewButton?: boolean;
    showFilter?: boolean;
    searchPlaceholder?: string;
    filterOptions?: { value: string; label: string }[];
    categories?: { id: string; name: string }[];
    selectedCategory?: string;
}

export default function HeaderSearch({
    icon: Icon,
    iconClass,
    iconBgColor,
    title,
    subtitle,
    onSearch,
    onFilterChange,
    onNewCredential,
    showNewButton = true,
    showFilter = true,
    searchPlaceholder = 'Pesquisar...',
    filterOptions: customFilterOptions,
    categories = [],
    selectedCategory = '',
}: HeaderSearchProps) {
    const [filterOptions, setFilterOptions] = useState<
        { value: string; label: string }[]
    >([]);

    useEffect(() => {
        if (customFilterOptions && customFilterOptions.length > 0) {
            setFilterOptions(customFilterOptions);
            return;
        }

        if (categories.length > 0) {
            const options = [
                { value: '', label: 'Todas as categorias' },
                ...categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                })),
            ];
            setFilterOptions(options);
            return;
        }

        setFilterOptions([{ value: '', label: 'Todos' }]);
    }, [categories, customFilterOptions]);

    return (
        <div className="border-b border-white/10 bg-background/50 px-4 pb-4 pt-0 sm:pt-4">
            <div className="mx-auto max-w-7xl">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBgColor}`}
                        >
                            <Icon className={`h-6 w-6 ${iconClass}`} />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-foreground lg:text-2xl">
                                {title}
                            </h1>

                            <p className="text-sm text-foreground/60">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {showNewButton && (
                            <Button
                                onClick={onNewCredential}
                                size="sm"
                                className="px-2 lg:px-4"
                                aria-label="Nova credencial"
                            >
                                <PlusIcon className="h-5 w-5" />

                                <span className="hidden sm:inline">
                                    Nova Credencial
                                </span>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex-1 sm:flex-4">
                        <InputTextForm
                            type="search"
                            placeholder={searchPlaceholder}
                            leftIcon={<SearchIcon className="h-5 w-5" />}
                            onChange={(e) => onSearch?.(e.target.value)}
                        />
                    </div>

                    {showFilter && filterOptions.length > 0 && (
                        <div className="sm:flex-1">
                            <InputSelectForm
                                options={filterOptions}
                                placeholder={filterOptions[0]?.label || 'Todos'}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    onFilterChange?.(value === '' ? '' : value);
                                }}
                                value={selectedCategory}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
