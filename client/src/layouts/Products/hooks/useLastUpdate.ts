import { useState, useEffect } from 'react';
import * as services from '@services/Products.services';

const useLastUpdate = () => {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLastUpdate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await services.getLastUpdate();
      setLastUpdate(response.lastUpdate ? new Date(response.lastUpdate) : null);
    } catch (err) {
      setError('Error al obtener la fecha de última actualización');
      console.error('Error fetching last update:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLastUpdate();
  }, []);

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Nunca';
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return {
    lastUpdate,
    isLoading,
    error,
    formatDate,
    refetch: fetchLastUpdate,
  };
};

export default useLastUpdate;
