import { useCallback, useState } from 'react';
import { getPriorityById, getPriorities } from '../../services/items/priority.service.ts';
import { Priority } from '../../types/priority.type.ts';
import { ApiQueryParams } from '../../../../types/common/api.types.ts';

export function usePriority() {
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [priority, setPriority] = useState<Priority | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar estado por id dentro de la colección cargada
  const findById = useCallback(
    (id?: number | string) => {
      return priorities.find((item) => String(item.id) === String(id));
    },
    [priorities],
  );

  // Obtener nombre por id
  const getNameById = useCallback(
    (id?: number | string) => {
      return findById(id)?.pri_name ?? '';
    },
    [findById],
  );

  // Obtener lista
  const getAll = useCallback(async (params?: ApiQueryParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getPriorities(params);
      setPriorities(response);

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
      const response = await getPriorityById(id);
      setPriority(response);

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
    priorities,
    priority,

    isLoading,
    error,

    getAll,
    getById,

    findById,
    getNameById,

    refetch: getAll,
  };
}
