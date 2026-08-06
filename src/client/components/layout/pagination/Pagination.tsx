'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    siblingCount = 1,
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        const startPage = Math.max(1, currentPage - siblingCount);
        const endPage = Math.min(totalPages, currentPage + siblingCount);

        if (startPage > 1) {
            pageNumbers.push(1);
            if (startPage > 2) {
                pageNumbers.push('...');
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push('...');
            }
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex justify-center sm:justify-between items-center gap-4 px-4 py-3 border-t border-white/10">
            <div className="text-sm text-foreground/60 hidden sm:block">
                Mostrando{' '}
                <span className="font-medium text-foreground/80">
                    {startItem}
                </span>{' '}
                a{' '}
                <span className="font-medium text-foreground/80">
                    {endItem}
                </span>{' '}
                de{' '}
                <span className="font-medium text-foreground/80">
                    {totalItems}
                </span>{' '}
                resultados
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Página anterior"
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1 mx-1">
                    {pageNumbers.map((page, index) => {
                        if (page === '...') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-2 py-1 text-sm text-foreground/40"
                                >
                                    …
                                </span>
                            );
                        }

                        const isActive = page === currentPage;

                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page as number)}
                                className={`
                                    cursor-pointer min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-colors
                                    ${
                                        isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-white/5 text-foreground/60 hover:text-foreground'
                                    }
                                `}
                                aria-label={`Página ${page}`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Próxima página"
                >
                    <ChevronRightIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
