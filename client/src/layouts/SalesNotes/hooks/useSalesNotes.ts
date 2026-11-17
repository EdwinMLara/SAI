import { useCallback, useState } from 'react';

import { SalesNoteInterface } from '@interfaces/SalesNote.interfaces';
import * as services from '@services/SalesNotes.services';

interface UseSalesNotesReturn {
  notes: SalesNoteInterface[];
  isLoading: boolean;
  error: string;
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  fetchNotes: () => Promise<void>;
  goToPage: (page: number) => void;
  remove: (reference: string) => Promise<{ status: number; message: string }>;
}

const DEFAULT_LIMIT = 10;

const useSalesNotes = (): UseSalesNotesReturn => {
  const [notes, setNotes] = useState<SalesNoteInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await services.getAllSalesNotes({
        page,
        limit: DEFAULT_LIMIT,
      });

      if (response.notes.length === 0 && response.page > 1) {
        setPage(response.page - 1);
        return;
      }

      setNotes(response.notes);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setPage(response.page);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar las notas de venta'
      );
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const goToPage = (nextPage: number) => {
    if (nextPage < 1) return;
    if (totalPages > 0 && nextPage > totalPages) return;
    setPage(nextPage);
  };

  const remove = async (reference: string) => {
    const response = await services.deleteSalesNote(reference);
    await fetchNotes();
    return response;
  };

  return {
    notes,
    isLoading,
    error,
    total,
    totalPages,
    page,
    limit: DEFAULT_LIMIT,
    fetchNotes,
    goToPage,
    remove,
  };
};

export default useSalesNotes;
