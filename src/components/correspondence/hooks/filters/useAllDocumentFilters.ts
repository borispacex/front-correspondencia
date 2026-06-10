import { useMemo, useState } from 'react';

import { Document } from '../../types/documents/document.type';

export interface AllDocumentFilters {
  nro: string;
  nroCite: string;
  subject: string;
  priority: string;
  status: string;
  sender: string;
}

export interface AllDocumentSortConfig {
  field: string;
  dir: 'asc' | 'desc';
}

const INITIAL_FILTERS: AllDocumentFilters = {
  nro: '',
  nroCite: '',
  subject: '',
  priority: '',
  status: '',
  sender: '',
};

const INITIAL_SORT: AllDocumentSortConfig = {
  field: 'id',
  dir: 'desc',
};

export function useAllDocumentFilters(documents: Document[]) {
  const [filters, setFilters] = useState<AllDocumentFilters>(INITIAL_FILTERS);

  const [sort, setSort] = useState<AllDocumentSortConfig>(INITIAL_SORT);

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSort(INITIAL_SORT);
  };

  const filteredDocuments = useMemo(() => {
    const filtered = documents.filter((document) => {
      const nroMatch =
        !filters.nro ||
        String(document.doc_contador ?? '')
          .toLowerCase()
          .includes(filters.nro.toLowerCase());

      const nroCiteMatch =
        !filters.nroCite ||
        String(document.doc_numero_cite ?? '')
          .toLowerCase()
          .includes(filters.nroCite.toLowerCase());

      const senderMatch =
        !filters.sender ||
        String(document.doc_remite ?? '')
          .toLowerCase()
          .includes(filters.sender.toLowerCase());

      const subjectMatch =
        !filters.subject ||
        String(document.doc_referencia ?? '')
          .toLowerCase()
          .includes(filters.subject.toLowerCase());

      const priorityMatch =
        !filters.priority ||
        String(document.priority_id ?? '')
          .toLowerCase()
          .includes(filters.priority.toLowerCase());

      const statusMatch =
        !filters.status ||
        String(document.state_document_id ?? '')
          .toLowerCase()
          .includes(filters.status.toLowerCase());

      return nroMatch && nroCiteMatch && senderMatch && subjectMatch && priorityMatch && statusMatch;
    });

    return [...filtered].sort((a, b) => {
      const aVal = String(a[sort.field as keyof Document] ?? '');
      const bVal = String(b[sort.field as keyof Document] ?? '');

      const cmp = aVal.localeCompare(bVal, undefined, {
        numeric: true,
        sensitivity: 'base',
      });

      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [documents, filters, sort]);

  return {
    filters,
    setFilters,

    sort,
    setSort,

    resetFilters,

    filteredDocuments,
  };
}
