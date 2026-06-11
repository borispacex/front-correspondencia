import { usePermissions } from '../../../../hooks/usePermissions.ts';
import { PENDING_STATE_IDS } from '../../components/router/RouterStatusTabs.tsx';
import { useNotifications } from '../../../../hooks/useNotification.tsx';
import { useRouterPage } from '../../hooks/useRouterPage.ts';
import { Document } from '../../types/documents/document.type.ts';
import PageMeta from '../../../common/PageMeta.tsx';
import PageBreadCrumb from '../../../common/PageBreadCrumb.tsx';
import { RouterFilter } from '../../components/router/RouterFilter.tsx';
import RouterTable from '../../components/router/RouterTable.tsx';
import { APP_NAME } from '../../constants/correspondence.constants.ts';
import { ROUTES } from '../../../../constants/routes.constants.ts';
import { useNavigate } from 'react-router';

const isPending = (stateId: number) => PENDING_STATE_IDS.includes(stateId);

export default function RouterPendingPage() {
  const { can } = usePermissions();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const { documents, isLoading, filters, setFilters, sort, setSort } = useRouterPage(isPending);
  // ── Handlers ────────────────────────────────────────────────
  const handleViewRoutes = (document: Document) => console.log('Rutas:', document);
  const handleView = (document: Document) => {
    console.log('Ver documento', document);
    navigate(`${ROUTES.CORRESPONDENCESS.ROUTE_SHEET.PENDING}/${document.id}`);
  };
  const handleReceive = (document_id: number) => {
    console.log('Recibir', document_id);
  };
  // ── Render ───────────────────────────────────────────────────
  return (
    <>
      <PageMeta title={`Bandeja de entrada | ${APP_NAME}`} description="Documentos pendientes de atención" />
      <PageBreadCrumb pageTitle="Bandeja de entrada" />

      <div className="space-y-5">
        {/* Indicador de estado */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 dark:border-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-300">
            <span className="size-2 animate-pulse rounded-full bg-yellow-500" />
            Pendientes · {documents.length}
          </span>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <RouterFilter filters={filters} sort={sort} onFiltersChange={setFilters} onSortChange={setSort} />
        </div>

        {/* Tabla */}
        <RouterTable
          documents={documents}
          isLoading={isLoading}
          onReceive={handleReceive}
          onViewRoutes={handleViewRoutes}
          onView={handleView}
        />
      </div>
    </>
  );
}
