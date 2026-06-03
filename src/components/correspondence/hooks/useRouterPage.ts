import { useCallback, useEffect, useMemo, useState } from 'react';
import { Document, DocumentFilters, SortConfig } from '../types/documents/document.type.ts';
import { getDocuments } from '../services/document.service.ts';

type StateFilterFn = (stateId: number) => boolean;

export function useRouterPage(filterByState: StateFilterFn) {
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<DocumentFilters>({
    nro: '',
    old: '',
    origin: '',
    subject: '',
    priority: '',
  });

  const [sort, setSort] = useState<SortConfig>({ field: 'id', dir: 'desc' });

  // ── Fetch ──────────────────────────────────────────────────
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getDocuments();
      setAllDocuments(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // ── Documentos filtrados por estado + texto + sort ─────────
  const documents = useMemo(() => {
    const filtered = allDocuments.filter((doc) => {
      if (!filterByState(doc.state_document_id)) return false;

      const nroMatch =
        !filters.nro ||
        String(doc.doc_contador ?? '')
          .toLowerCase()
          .includes(filters.nro.toLowerCase());
      const oldMatch =
        !filters.old ||
        String(doc.doc_cite ?? '')
          .toLowerCase()
          .includes(filters.old.toLowerCase());
      const originMatch =
        !filters.origin ||
        String(doc.doc_dep_name ?? '')
          .toLowerCase()
          .includes(filters.origin.toLowerCase());
      const subjectMatch =
        !filters.subject ||
        String(doc.doc_referencia ?? '')
          .toLowerCase()
          .includes(filters.subject.toLowerCase());
      const priorityMatch =
        !filters.priority ||
        String(doc.pri_name ?? '')
          .toLowerCase()
          .includes(filters.priority.toLowerCase());

      return nroMatch && oldMatch && originMatch && subjectMatch && priorityMatch;
    });

    return [...filtered].sort((a, b) => {
      const aVal = String(a[sort.field as keyof Document] ?? '');
      const bVal = String(b[sort.field as keyof Document] ?? '');
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [allDocuments, filters, sort, filterByState]);

  return {
    documents,
    isLoading,
    filters,
    setFilters,
    sort,
    setSort,
    fetchDocuments,
  };
}
