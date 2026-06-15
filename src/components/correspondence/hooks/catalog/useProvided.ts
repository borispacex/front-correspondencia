import { useCallback } from 'react';
import { useCatalog } from '../../context/CatalogContext.tsx';

const DEFAULT_BADGE = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200';
const PROVIDED_COLORS: Record<number, string> = {
  // Acción
  1: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200', // EJECUTAR
  7: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200', // URGENTE
  9: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200', // DAR CUMPLIMIENTO

  // Revisión / análisis
  3: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200', // ANALIZAR E INFORMAR
  4: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200', // SU OPINION
  14: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200', // INFORMAR
  15: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200', // REVISAR

  // Aprobación
  2: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200', // AUTORIZADO
  18: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200', // PARA AUTORIZACION

  // Gestión / proceso
  16: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200', // ATENDER
  17: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200', // PROCESAR
  20: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200', // PROCESAR CONFORME A NORMA
  21: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200', // REGISTRAR
  22: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200', // HACER SEGUIMIENTO

  // Información
  5: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', // TOMAR NOTA
  11: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', // PARA SU CONOCIMIENTO
  13: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', // FINES CONSIGUIENTES

  // Coordinación
  10: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200', // COORDINAR CON
  19: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200', // PARA SU CONSIDERACION

  // Archivo
  8: 'bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-200', // ARCHIVAR
};

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

  const getNamesByIds = useCallback(
    (ids?: string | null) => {
      if (!ids) return [];

      return ids
        .split(',')
        .map((id) => getNameById(Number(id.trim())))
        .filter(Boolean);
    },
    [getNameById],
  );

  const getBadgeClassById = useCallback((id?: number | string) => {
    if (!id) return DEFAULT_BADGE;
    return PROVIDED_COLORS[Number(id)] ?? DEFAULT_BADGE;
  }, []);

  return {
    provides,

    findById,
    getNameById,
    getNamesByIds,
    getBadgeClassById,
  };
}
