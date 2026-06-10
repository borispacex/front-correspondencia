import { useCallback } from 'react';
import { useCatalog } from '../../context/CatalogContext.tsx';

export function usePriority() {
  const { priorities } = useCatalog();

  const findById = useCallback(
    (id?: number | string) => {
      return priorities.find((item) => String(item.id) === String(id));
    },
    [priorities],
  );

  const getNameById = useCallback(
    (id?: number | string) => {
      const priority = findById(id);

      return priority?.pri_name.match(/>(.*?)</)?.[1] ?? '';
    },
    [findById],
  );

  const getBadgeClassById = useCallback((id?: number | string) => {
    switch (Number(id)) {
      case 1:
        return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';

      case 2:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';

      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300';
    }
  }, []);

  return {
    priorities,

    findById,
    getNameById,
    getBadgeClassById,
  };
}
