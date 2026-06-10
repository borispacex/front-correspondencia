import { useCallback, useState } from 'react';
import { getDepartmentById, getDepartments } from '../../services/items/department.service.ts';
import { Department } from '../../types/items/department.type.ts';
import { ApiQueryParams } from '../../../../types/common/api.types.ts';

export function useDepartment() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [department, setDepartment] = useState<Department | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar estado por id dentro de la colección cargada
  const findById = useCallback(
    (id?: number | string) => {
      return departments.find((item) => String(item.id) === String(id));
    },
    [departments],
  );

  // Obtener nombre por id
  const getNameById = useCallback(
    (id?: number | string) => {
      return findById(id)?.dep_name ?? '';
    },
    [findById],
  );

  // Obtener lista
  const getAll = useCallback(async (params?: ApiQueryParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getDepartments(params);
      setDepartments(response);

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
      const response = await getDepartmentById(id);
      setDepartment(response);

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
    departments,
    department,

    isLoading,
    error,

    getAll,
    getById,

    findById,
    getNameById,

    refetch: getAll,
  };
}
