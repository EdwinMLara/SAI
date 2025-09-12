import { useState, useEffect, useCallback } from 'react';
import { ProductServices } from '../../../core/services';

interface LastUpdateData {
   lastUpdate: string | null;
   totalProducts: number;
}

interface UseLastUpdateReturn {
   lastUpdate: string | null;
   totalProducts: number;
   isLoading: boolean;
   error: string | null;
   formatDate: (dateString: string | null) => string;
   refetch: () => Promise<void>;
}

const useLastUpdate = (): UseLastUpdateReturn => {
   const [data, setData] = useState<LastUpdateData>({
      lastUpdate: null,
      totalProducts: 0,
   });
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   const formatDate = useCallback((dateString: string | null): string => {
      if (!dateString) return 'Nunca actualizada';

      try {
         const date = new Date(dateString);
         return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
         }).format(date);
      } catch {
         return 'Fecha inválida';
      }
   }, []);

   const fetchLastUpdate = useCallback(async (): Promise<void> => {
      try {
         setIsLoading(true);
         setError(null);

         const response = await ProductServices.getLastUpdate();
         if (response.data) {
            setData(response.data);
         }
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : 'Error desconocido';
         setError(errorMessage);
         console.error('Error fetching last update:', err);
      } finally {
         setIsLoading(false);
      }
   }, []);

   const refetch = useCallback(async (): Promise<void> => {
      await fetchLastUpdate();
   }, [fetchLastUpdate]);

   useEffect(() => {
      fetchLastUpdate();
   }, [fetchLastUpdate]);

   return {
      lastUpdate: data.lastUpdate,
      totalProducts: data.totalProducts,
      isLoading,
      error,
      formatDate,
      refetch,
   };
};

export default useLastUpdate;
