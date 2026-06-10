import { useCallback, useState } from 'react';
import { getStateDocumentById, getStateDocuments } from '../../services/catalog/state-document.service.ts';
import { StateDocument } from '../../types/catalog/state-document.type.ts';
import { ApiQueryParams } from '../../../../types/common/api.types.ts';

export function useStateDocument() {
  const [stateDocuments, setStateDocuments] = useState<StateDocument[]>([]);
  const [stateDocument, setStateDocument] = useState<StateDocument | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Obtener lista
  const getAll = useCallback(async (params?: ApiQueryParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getStateDocuments(params);
      setStateDocuments(response);

      return response;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Error al obtener los estados del documento';

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener por id desde API
  const getById = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getStateDocumentById(id);
      setStateDocument(response);

      return response;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Error al obtener el estado documento';

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    stateDocuments,
    stateDocument,

    isLoading,
    error,

    getAll,
    getById,

    findById,
    getNameById,

    refetch: getAll,
  };
}
