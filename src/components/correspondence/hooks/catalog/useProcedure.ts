import { useCallback } from 'react';
import { useCatalog } from '../../context/CatalogContext.tsx';

export function useProcedure() {
  const { procedures } = useCatalog();

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

  return {
    procedures,

    findById,
    getNameById,
  };
}
