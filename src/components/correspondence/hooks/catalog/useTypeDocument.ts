import { useCallback } from 'react';
import { useCatalog } from '../../context/CatalogContext.tsx';

export function useTypeDocument() {
  const { typeDocuments } = useCatalog();

  // Buscar estado por id dentro de la colección cargada
  const findById = useCallback(
    (id?: number | string) => {
      return typeDocuments.find((item) => String(item.id) === String(id));
    },
    [typeDocuments],
  );

  // Obtener nombre por id
  const getNameById = useCallback(
    (id?: number | string) => {
      return findById(id)?.typ_name ?? '';
    },
    [findById],
  );

  return {
    typeDocuments,

    findById,
    getNameById,
  };
}
