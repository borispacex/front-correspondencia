import { usePermissions } from '../../../../hooks/usePermissions.ts';
import { useNotifications } from '../../../../hooks/useNotification.tsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DocumentFilters, Document } from '../../types/documents/document.type.ts';
import { getDocuments } from '../../services/document.service.ts';
import PageMeta from '../../../common/PageMeta.tsx';
import PageBreadCrumb from '../../../common/PageBreadCrumb.tsx';

import { APP_NAME } from '../../constants/correspondence.constants.ts';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../../../constants/routes.constants.ts';

import { PendingFilter, PendingSortConfig } from '../../components/correspondence/pending/PendingFilter.tsx';
import PendingTable from '../../components/correspondence/pending/PendingTable.tsx';

export default function PendingPage() {
  const { can } = usePermissions();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // Filters, sort y status tab
  // ─────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<DocumentFilters>({
    nro: '',
    old: '',
    origin: '',
    subject: '',
    priority: '',
  });
  const [sort, setSort] = useState<PendingSortConfig>({ field: 'id', dir: 'desc' });
  // ─────────────────────────────────────────────────────────────
  // Filtered data
  // ─────────────────────────────────────────────────────────────
  const filteredDocuments = useMemo(() => {
    const filtered = documents.filter((document) => {
      const nroMatch =
        !filters.nro ||
        String(document.doc_contador ?? '')
          .toLowerCase()
          .includes(filters.nro.toLowerCase());
      const oldMatch =
        !filters.old ||
        String(document.doc_cite ?? '')
          .toLowerCase()
          .includes(filters.old.toLowerCase());
      const originMatch =
        !filters.origin ||
        String(document.doc_dep_name ?? '')
          .toLowerCase()
          .includes(filters.origin.toLowerCase());
      const subjectMatch =
        !filters.subject ||
        String(document.doc_referencia ?? '')
          .toLowerCase()
          .includes(filters.subject.toLowerCase());
      const priorityMatch =
        !filters.priority ||
        String(document.pri_name ?? '')
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
  }, [documents, filters, sort]);

  // ─────────────────────────────────────────────────────────────
  // Load data
  // ─────────────────────────────────────────────────────────────
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getDocuments();
      setDocuments(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // ─────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────
  const handleViewRoutes = (document: Document) => console.log('ver ruta:', document);
  const handleView = (document: Document) => {
    console.log('Ver tramite', document);
    navigate(`${ROUTES.CORRESPONDENCE.PENDING.ALL}/${document.id}`);
  };
  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <>
      <PageMeta title={`Buscar trámite | ${APP_NAME}`} description="Buscador de tramites" />
      <PageBreadCrumb pageTitle="Buscar trámite" />

      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <PendingFilter filters={filters} sort={sort} onFiltersChange={setFilters} onSortChange={setSort} />
        </div>

        <PendingTable
          documents={filteredDocuments}
          isLoading={isLoading}
          onViewRoutes={handleViewRoutes}
          onView={handleView}
        />
      </div>

      {/********************************** MODALES ***********************************/}
    </>
  );
}
