import { useCallback } from 'react';
import { useCatalog } from '../../context/CatalogContext.tsx';

const DEFAULT_BADGE = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200';

const STATE_COLORS: Record<number, string> = {
  1: DEFAULT_BADGE,
  2: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
  3: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  4: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  5: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
  6: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
  7: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
  8: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
};

export function useStateDocument() {
  const { stateDocuments } = useCatalog();

  // Buscar estado por id dentro de la colección cargada
  const findById = useCallback(
    (id?: number | string) => {
      return stateDocuments.find((item) => String(item.id) === String(id));
    },
    [stateDocuments],
  );

  // Obtener nombre por id
  const getNameById = useCallback(
    (id?: number | string) => {
      return findById(id)?.sdoc_name ?? '';
    },
    [findById],
  );

  const getBadgeClassById = useCallback((id?: number | string) => {
    if (!id) return DEFAULT_BADGE;
    return STATE_COLORS[Number(id)] ?? DEFAULT_BADGE;
  }, []);

  return {
    stateDocuments,

    findById,
    getNameById,

    getBadgeClassById,
  };
}
