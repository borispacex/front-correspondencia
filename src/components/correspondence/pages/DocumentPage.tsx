import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNotifications } from '../../../hooks/useNotification.tsx';
import PageMeta from '../../common/PageMeta.tsx';
import PageBreadCrumb from '../../common/PageBreadCrumb.tsx';
import { Document, DocumentFilters, SortConfig } from '../types/documents/document.type.ts';
import DocumentTable from '../components/documents/DocumentTable.tsx';
import { getDocuments } from '../services/document.service.ts';
import { RouterFilter } from '../components/router/RouterFilter.tsx';
import DocumentStatusTabs, {
  DocumentStatusTab,
  MY_DOCUMENT_STATE_IDS,
  SIGNED_STATE_IDS,
} from '../components/documents/DocumentStatusTabs.tsx';
import { APP_NAME } from '../constants/correspondence.constants.ts';

export default function DocumentPage() {
  const { addNotification } = useNotifications();

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

  const [sort, setSort] = useState<SortConfig>({ field: 'id', dir: 'desc' });

  const [statusTab, setStatusTab] = useState<DocumentStatusTab>('all');

  // ─────────────────────────────────────────────────────────────
  // Conteos para los tabs
  // ─────────────────────────────────────────────────────────────
  const tabCounts = useMemo(
    () => ({
      all: documents.length,
      mine: documents.filter((d) => MY_DOCUMENT_STATE_IDS.includes(d.state_document_id)).length,
      signed: documents.filter((d) => SIGNED_STATE_IDS.includes(d.state_document_id)).length,
    }),
    [documents],
  );

  // ─────────────────────────────────────────────────────────────
  // Filtered data (tab + filtros de texto + sort)
  // ─────────────────────────────────────────────────────────────
  const filteredDocuments = useMemo(() => {
    const filtered = documents.filter((document) => {
      // ── Filtro por tab ─────────────────────────────────────────
      if (statusTab === 'mine' && !MY_DOCUMENT_STATE_IDS.includes(document.state_document_id)) return false;
      if (statusTab === 'signed' && !SIGNED_STATE_IDS.includes(document.state_document_id)) return false;

      // ── Filtros de texto ───────────────────────────────────────
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
  }, [documents, filters, sort, statusTab]);

  // ─────────────────────────────────────────────────────────────
  // Load data
  // ─────────────────────────────────────────────────────────────
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message ?? 'Error al cargar los documentos',
      });
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
  function handleView(document: Document) {
    console.log('Ver documento', document);
  }

  function handleViewRoutes(document: Document) {
    console.log('Ver rutas', document);
  }

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <>
      <PageMeta title={`Documentos | ${APP_NAME}`} description="Gestión y visualización de documentos" />
      <PageBreadCrumb pageTitle="Documentos" />

      <div className="space-y-5">
        {/* Tabs de estado */}
        <DocumentStatusTabs active={statusTab} counts={tabCounts} onChange={(tab) => setStatusTab(tab)} />

        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <RouterFilter filters={filters} sort={sort} onFiltersChange={setFilters} onSortChange={setSort} />
        </div>

        {/* Tabla */}
        <DocumentTable
          documents={filteredDocuments}
          isLoading={isLoading}
          onView={handleView}
          onViewRoutes={handleViewRoutes}
        />
      </div>
    </>
  );
}
