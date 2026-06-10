import { useCallback } from 'react';
import { useCatalog } from '../../context/CatalogContext.tsx';

export function useProvided() {
  const { provides } = useCatalog();

  // Buscar estado por id dentro de la colección cargada
  const findById = useCallback(
    (id?: number | string) => {
      return provides.find((item) => String(item.id) === String(id));
    },
    [provides],
  );

  // Obtener nombre por id
  const getNameById = useCallback(
    (id?: number | string) => {
      return findById(id)?.prov_name ?? '';
    },
    [findById],
  );

  return {
    provides,

    findById,
    getNameById,
  };
}
