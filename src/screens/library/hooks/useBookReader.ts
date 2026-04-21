import { useState, useEffect, useCallback } from 'react';
import { BookService }  from '../service/BookService';
import { useBooksStore } from '../store/useBooksStore';
import { BookPage }     from '@/shared/types';

export function useBookReader(bookId: string) {
  const { updateProgress } = useBooksStore();
  const [pages,       setPages]       = useState<BookPage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading,   setIsLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [allPages, book] = await Promise.all([
          BookService.getPages(bookId),
          BookService.getBook(bookId),
        ]);
        setPages(allPages);
        if (book) setCurrentPage(book.currentPage);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [bookId]);

  const goToPage = useCallback(async (page: number) => {
    const clamped = Math.max(1, Math.min(page, pages.length));
    setCurrentPage(clamped);
    await updateProgress(bookId, clamped, pages.length);
  }, [bookId, pages.length, updateProgress]);

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  const activePage = pages.find(p => p.pageNumber === currentPage) ?? null;
  const progress   = pages.length > 0
    ? Math.round((currentPage / pages.length) * 100)
    : 0;

  return {
    pages,
    activePage,
    currentPage,
    totalPages: pages.length,
    progress,
    isLoading,
    nextPage,
    prevPage,
    goToPage,
  };
}