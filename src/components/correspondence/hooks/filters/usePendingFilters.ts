import { useMemo, useState } from 'react';

import { Router } from '../../types/routers/router.type';

export interface PendingFilters {
  nro: string;
  nroCite: string;
  subject: string;
  priority: string;
  sender: string;
  typeDocument: string;
}

export interface PendingSortConfig {
  field: string;
  dir: 'asc' | 'desc';
}

const INITIAL_FILTERS: PendingFilters = {
  nro: '',
  nroCite: '',
  subject: '',
  priority: '',
  sender: '',
  typeDocument: '',
};

const INITIAL_SORT: PendingSortConfig = {
  field: 'id',
  dir: 'desc',
};

export function usePendingFilters(routers: Router[]) {
  const [filters, setFilters] = useState<PendingFilters>(INITIAL_FILTERS);

  const [sort, setSort] = useState<PendingSortConfig>(INITIAL_SORT);

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSort(INITIAL_SORT);
  };

  const filteredRouters = useMemo(() => {
    const filtered = routers.filter((router) => {
      const nroMatch =
        !filters.nro ||
        String(router.document?.doc_contador ?? '')
          .toLowerCase()
          .includes(filters.nro.toLowerCase());

      const nroCiteMatch =
        !filters.nroCite ||
        String(router.rout_numero_cite ?? '')
          .toLowerCase()
          .includes(filters.nroCite.toLowerCase());

      const senderMatch =
        !filters.sender ||
        String(router.rout_remite_document ?? '')
          .toLowerCase()
          .includes(filters.sender.toLowerCase());

      const subjectMatch =
        !filters.subject ||
        String(router.rout_referencia_document ?? '')
          .toLowerCase()
          .includes(filters.subject.toLowerCase());

      const priorityMatch =
        !filters.priority || !filters.priority || String(router.priority_id ?? '') === String(filters.priority);

      const typeDocumentMatch =
        !filters.typeDocument || String(router.type_document_id ?? '') === String(filters.typeDocument);

      return nroMatch && nroCiteMatch && senderMatch && subjectMatch && priorityMatch && typeDocumentMatch;
    });

    return [...filtered].sort((a, b) => {
      const aVal = String(a[sort.field as keyof Router] ?? '');
      const bVal = String(b[sort.field as keyof Router] ?? '');

      const cmp = aVal.localeCompare(bVal, undefined, {
        numeric: true,
        sensitivity: 'base',
      });

      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [routers, filters, sort]);

  return {
    filters,
    setFilters,

    sort,
    setSort,

    resetFilters,

    filteredRouters,
  };
}
