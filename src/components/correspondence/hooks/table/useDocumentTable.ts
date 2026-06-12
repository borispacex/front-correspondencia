import { useMemo, useState } from 'react';
import { Document } from '../../types/documents/document.type.ts';
import { getYear } from '../../../../utils/format.utils.ts';

export const PER_PAGE_OPTIONS = [10, 25, 50, 100];

export interface UseDocumentTableOptions {
  documents: Document[];
  defaultPerPage?: number;
}

export function useDocumentTable({ documents, defaultPerPage = 10 }: UseDocumentTableOptions) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [sortField, setSortField] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // ── Sorting ───────────────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    if (!sortField) return documents;
    return [...documents].sort((a, b) => {
      const aVal = String(a[sortField as keyof Document] ?? '');
      const bVal = String(b[sortField as keyof Document] ?? '');
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [documents, sortField, sortDir]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const total = documents.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * perPage + 1;
  const to = Math.min(safePage * perPage, total);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage;
    return sorted.slice(start, start + perPage);
  }, [sorted, safePage, perPage]);

  function handlePerPageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPerPage(Number(e.target.value));
    setPage(1);
  }

  function handleSort(field: string) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  }

  function renderPageNumbers(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (safePage > 3) pages.push('...');
    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
      pages.push(i);
    }
    if (safePage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  // ── Copy ──────────────────────────────────────────────────────────────────
  async function handleCopy(document: Document) {
    try {
      await navigator.clipboard.writeText(`${document.doc_contador ?? ''}/${getYear(document.created_at) ?? ''}`);
      setCopiedId(document.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch (error) {
      console.error('Error copiando', error);
    }
  }

  return {
    // pagination state
    page: safePage,
    perPage,
    total,
    totalPages,
    from,
    to,
    paginated,
    setPage,
    handlePerPageChange,
    // sort
    sortField,
    sortDir,
    handleSort,
    renderPageNumbers,
    // copy
    copiedId,
    handleCopy,
  };
}
