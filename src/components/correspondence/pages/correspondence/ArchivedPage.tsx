import { ARCHIVED_STATE_IDS } from '../../components/router/RouterStatusTabs.tsx';
import { usePermissions } from '../../../../hooks/usePermissions.ts';
import { useNotifications } from '../../../../hooks/useNotification.tsx';
import { useRouterPage } from '../../hooks/useRouterPage.ts';
import { Document } from '../../types/documents/document.type.ts';
import PageMeta from '../../../common/PageMeta.tsx';
import PageBreadCrumb from '../../../common/PageBreadCrumb.tsx';
import { RouterFilter } from '../../components/router/RouterFilter.tsx';
import { APP_NAME } from '../../constants/correspondence.constants.ts';
import { ROUTES } from '../../../../constants/routes.constants.ts';
import { useNavigate } from 'react-router';
import ArchivedTable from '../../components/correspondence/archived/ArchivedTable.tsx';

const isArchived = (stateId: number) => ARCHIVED_STATE_IDS.includes(stateId);

export default function ArchivedPage() {
  const { can } = usePermissions();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const isArchived = (stateId: number) => ARCHIVED_STATE_IDS.includes(stateId);

  const { documents, isLoading, filters, setFilters, sort, setSort, fetchDocuments } = useRouterPage(isArchived);

  // ── Handlers ────────────────────────────────────────────────
  const handleViewRoutes = (document: Document) => {
    console.log('Rutas:', document);
  };
  const handleUnarchive = (document_id: number) => {
    console.log('Desarchivar:', document_id);
  };
  const handleView = (document: Document) => {
    console.log('Ver documento', document);
    navigate(`${ROUTES.CORRESPONDENCE.ARCHIVED.ALL}/${document.id}`);
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <>
      <PageMeta title={`Archivados | ${APP_NAME}`} description="Documentos archivados" />
      <PageBreadCrumb pageTitle="Archivados" />

      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-gray-400">
            <span className="size-2 rounded-full bg-gray-400" />
            Archivados · {documents.length}
          </span>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <RouterFilter filters={filters} sort={sort} onFiltersChange={setFilters} onSortChange={setSort} />
        </div>

        {/* Tabla */}
        <ArchivedTable
          documents={documents}
          isLoading={isLoading}
          onViewRoutes={handleViewRoutes}
          onView={handleView}
          onUnarchive={handleUnarchive}
        />
      </div>
    </>
  );
}
