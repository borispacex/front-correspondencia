import { useCallback, useState } from 'react';
import { getProcedureById, getProcedures } from '../../services/catalog/procedure.service.ts';
import { Procedure } from '../../types/catalog/procedure.type.ts';
import { ApiQueryParams } from '../../../../types/common/api.types.ts';

export function useProcedure() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [procedure, setProcedure] = useState<Procedure | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar estado por id dentro de la colección cargada
  const findById = useCallback(
    (id?: number | string) => {
      return procedures.find((item) => String(item.id) === String(id));
    },
    [procedures],
  );

  // Obtener nombre por id
  const getNameById = useCallback(
    (id?: number | string) => {
      return findById(id)?.proc_name ?? '';
    },
    [findById],
  );

  // Obtener lista
  const getAll = useCallback(async (params?: ApiQueryParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getProcedures(params);
      setProcedures(response);

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
      const response = await getProcedureById(id);
      setProcedure(response);

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
    procedures,
    procedure,

    isLoading,
    error,

    getAll,
    getById,

    findById,
    getNameById,

    refetch: getAll,
  };
}
