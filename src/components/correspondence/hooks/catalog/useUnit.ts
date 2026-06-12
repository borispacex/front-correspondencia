import { useCallback } from 'react';
import { useCatalog } from '../../context/CatalogContext.tsx';

export function useUnit() {
  const { units } = useCatalog();

  // Buscar estado por id dentro de la colección cargada
  const findById = useCallback(
    (id?: number | string) => {
      return units.find((item) => String(item.id) === String(id));
    },
    [units],
  );

  // Obtener nombre por id
  const getNameById = useCallback(
    (id?: number | string) => {
      return findById(id)?.uni_name ?? '';
    },
    [findById],
  );

  return {
    units,

    findById,
    getNameById,
  };
}
