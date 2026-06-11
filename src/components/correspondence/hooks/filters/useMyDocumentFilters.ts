import { useMemo, useState } from 'react';

import { Document } from '../../types/documents/document.type';

export interface MyDocumentFilters {
  nro: string;
  nroCite: string;
  subject: string;
  priority: string;
  sender: string;
}

export interface MyDocumentSortConfig {
  field: string;
  dir: 'asc' | 'desc';
}

const INITIAL_FILTERS: MyDocumentFilters = {
  nro: '',
  nroCite: '',
  subject: '',
  priority: '',
  sender: '',
};

const INITIAL_SORT: MyDocumentSortConfig = {
  field: 'id',
  dir: 'desc',
};

export function useMyDocumentFilters(documents: Document[]) {
  const [filters, setFilters] = useState<MyDocumentFilters>(INITIAL_FILTERS);

  const [sort, setSort] = useState<MyDocumentSortConfig>(INITIAL_SORT);

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
        !filters.priority || !filters.priority || String(document.priority_id ?? '') === String(filters.priority);

      return nroMatch && nroCiteMatch && senderMatch && subjectMatch && priorityMatch;
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
