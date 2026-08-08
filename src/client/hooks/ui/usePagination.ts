import { useState, useCallback } from 'react';

interface UsePaginationProps {
    initialPage?: number;
    initialItemsPerPage?: number;
    totalItems?: number;
}

export function usePagination({
    initialPage = 1,
    initialItemsPerPage = 20,
    totalItems = 0,
}: UsePaginationProps = {}) {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
    const [totalItemsState, setTotalItemsState] = useState(totalItems);

    const totalPages = Math.max(1, Math.ceil(totalItemsState / itemsPerPage));

    const goToPage = useCallback(
        (page: number) => {
            const validPage = Math.max(1, Math.min(page, totalPages));
            setCurrentPage(validPage);
            return validPage;
        },
        [totalPages],
    );

    const nextPage = useCallback(() => {
        return goToPage(currentPage + 1);
    }, [currentPage, goToPage]);

    const previousPage = useCallback(() => {
        return goToPage(currentPage - 1);
    }, [currentPage, goToPage]);

    const resetPagination = useCallback(() => {
        setCurrentPage(1);
    }, []);

    const setTotalItems = useCallback((total: number) => {
        setTotalItemsState(total);
    }, []);

    const decrementTotalItems = useCallback(() => {
        setTotalItemsState((prev) => Math.max(0, prev - 1));
    }, []);

    const incrementTotalItems = useCallback(() => {
        setTotalItemsState((prev) => prev + 1);
    }, []);

    return {
        currentPage,
        itemsPerPage,
        totalItems: totalItemsState,
        totalPages,
        goToPage,
        nextPage,
        previousPage,
        resetPagination,
        setItemsPerPage,
        setTotalItems,
        decrementTotalItems,
        incrementTotalItems,
    };
}
