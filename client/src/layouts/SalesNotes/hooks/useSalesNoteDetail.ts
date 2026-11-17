import { useCallback, useEffect, useState } from 'react';

import { SalesNoteInterface } from '@interfaces/SalesNote.interfaces';
import * as services from '@services/SalesNotes.services';

interface UseSalesNoteDetailReturn {
  note: SalesNoteInterface | null;
  setNote: (note: SalesNoteInterface) => void;
  isLoading: boolean;
  error: string;
  refresh: () => Promise<void>;
}

const useSalesNoteDetail = (
  reference: string
): UseSalesNoteDetailReturn => {
  const [note, setNote] = useState<SalesNoteInterface | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const refresh = useCallback(async () => {
    if (!reference) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await services.getSalesNote(reference);
      setNote(response.note);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo cargar la nota de venta'
      );
    } finally {
      setIsLoading(false);
    }
  }, [reference]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { note, setNote, isLoading, error, refresh };
};

export default useSalesNoteDetail;
