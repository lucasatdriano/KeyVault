/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useEffect, useState } from 'react';
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

const HeaderSearch: React.FC<HeaderSearchProps> = ({
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
}) => {
    const [filterOptions, setFilterOptions] = useState<
        { value: string; label: string }[]
    >([]);

    useEffect(() => {
        if (categories.length > 0) {
            const options = [
                { value: '', label: 'Todas as categorias' },
                ...categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                })),
            ];
            setFilterOptions(options);
        } else if (customFilterOptions) {
            setFilterOptions(customFilterOptions);
        } else {
            setFilterOptions([{ value: '', label: 'Todas as categorias' }]);
        }
    }, [categories, customFilterOptions]);

    return (
        <div className="px-4 pt-0 pb-4 sm:pt-4 border-b border-white/10 bg-background/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-12 h-12 rounded-2xl ${iconBgColor} flex items-center justify-center`}
                        >
                            <Icon className={`w-6 h-6 ${iconClass}`} />
                        </div>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-foreground">
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
                                <PlusIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">
                                    Nova Credencial
                                </span>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 sm:flex-4">
                        <InputTextForm
                            type="search"
                            placeholder={searchPlaceholder}
                            leftIcon={<SearchIcon className="w-5 h-5" />}
                            onChange={(e) => onSearch?.(e.target.value)}
                        />
                    </div>

                    {showFilter && filterOptions.length > 0 && (
                        <div className="sm:flex-1">
                            <InputSelectForm
                                options={filterOptions}
                                placeholder="Todas as categorias"
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
};

export default HeaderSearch;
