import { useCallback, useState } from 'react';

import { getDocuments, getDocumentById } from '../services/document.service';

import { Document } from '../types/documents/document.type';
import { ApiQueryParams } from '../../../types/common/api.types';

export function useDocument() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [document, setDocument] = useState<Document | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────
  // Obtener lista
  // ─────────────────────────────────────────────────────────────
  const getAll = useCallback(async (params?: ApiQueryParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getDocuments(params);
      setDocuments(response);

      return response;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Error al obtener los documentos';

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Obtener por id
  // ─────────────────────────────────────────────────────────────
  const getById = useCallback(async (id: number, params?: ApiQueryParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getDocumentById(id, params);
      setDocument(response);

      return response;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Error al obtener el documento';

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // TODO: futuros endpoints
  // ─────────────────────────────────────────────────────────────

  /*
    const create = async (payload: CreateDocumentRequest) => {};
    const update = async (id: number, payload: UpdateDocumentRequest) => {};
    const remove = async (id: number) => {};
    const derive = async (...) => {};
    const archive = async (...) => {};
    const unarchive = async (...) => {};
    */

  return {
    documents,
    document,

    isLoading,
    error,

    getAll,
    getById,
  };
}
