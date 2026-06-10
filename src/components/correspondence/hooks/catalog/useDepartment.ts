import { useCallback } from 'react';
import { useCatalog } from '../../context/CatalogContext.tsx';

export function useDepartment() {
  const { departments } = useCatalog();

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

  return {
    departments,

    findById,
    getNameById,
  };
}
