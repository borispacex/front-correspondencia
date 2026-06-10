import { useCallback, useState } from 'react';
import { getTypeDocumentById, getTypeDocuments } from '../../services/items/type-document.service.ts';
import { TypeDocument } from '../../types/type-document.type.ts';
import { ApiQueryParams } from '../../../../types/common/api.types.ts';

export function useTypeDocument() {
  const [typeDocuments, setTypeDocuments] = useState<TypeDocument[]>([]);
  const [typeDocument, setTypeDocument] = useState<TypeDocument | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Obtener lista
  const getAll = useCallback(async (params?: ApiQueryParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getTypeDocuments(params);
      setTypeDocuments(response);

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
      const response = await getTypeDocumentById(id);
      setTypeDocument(response);

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
    typeDocuments,
    typeDocument,

    isLoading,
    error,

    getAll,
    getById,

    findById,
    getNameById,

    refetch: getAll,
  };
}
