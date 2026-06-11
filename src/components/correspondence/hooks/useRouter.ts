import { useCallback, useState } from 'react';

import { getRouters, getRouterById } from '../services/router.service';

import { Router } from '../types/routers/router.type';
import { ApiQueryParams } from '../../../types/common/api.types';

export function useRouter() {
  const [routers, setRouters] = useState<Router[]>([]);
  const [router, setRouter] = useState<Router | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener lista
  const getAll = useCallback(async (params?: ApiQueryParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getRouters(params);
      console.log('routes', response);
      setRouters(response);

      return response;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Error al obtener las rutas';

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener por id
  const getById = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getRouterById(id);
      setRouter(response);

      return response;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Error al obtener la ruta';

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    routers,
    router,

    isLoading,
    error,

    getAll,
    getById,

    refetch: getAll,
  };
}
