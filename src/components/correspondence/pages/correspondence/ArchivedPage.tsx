import { usePermissions } from '../../../../hooks/usePermissions.ts';
import { useNotifications } from '../../../../hooks/useNotification.tsx';
import PageMeta from '../../../common/PageMeta.tsx';
import PageBreadCrumb from '../../../common/PageBreadCrumb.tsx';
import { APP_NAME } from '../../constants/correspondence.constants.ts';
import { ROUTES } from '../../../../constants/routes.constants.ts';
import { useNavigate } from 'react-router';
import { ArchivedFilter } from '../../components/correspondence/archived/ArchivedFilter.tsx';
import ArchivedTable from '../../components/correspondence/archived/ArchivedTable.tsx';
import { useCallback, useEffect } from 'react';
import { useRouter } from '../../hooks/useRouter.ts';
import { useArchivedFilters } from '../../hooks/filters/useArchivedFilters.ts';
import { Router } from '../../types/routers/router.type.ts';
import { STATE } from '../../constants/state-document.constants.ts';

export default function ArchivedPage() {
  const { can } = usePermissions();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const { routers, isLoading, getAll } = useRouter();

  // ──────────────────────────── filters ─────────────────────────────────
  const { filters, setFilters, sort, setSort, resetFilters, filteredRouters } = useArchivedFilters(routers);
  // ──────────────────────────── Load data ─────────────────────────────────
  const fetchRouters = useCallback(async () => {
    await getAll({
      included: ['document'],
      filter: { state_document_id: [STATE.ARCHIVADO, STATE.ARCIVADO, STATE.ELIMINADO] },
    });
  }, [getAll]);
  useEffect(() => {
    getAll({
      included: ['document'],
      filter: { state_document_id: [STATE.ARCIVADO, STATE.ARCHIVADO, STATE.ELIMINADO] },
    });
  }, [getAll]);

  // ── Handlers ────────────────────────────────────────────────
  const handleViewRoutes = (router: Router) => {
    console.log('Rutas:', router);
  };
  const handleView = (router: Router) => {
    console.log('Ver documento', router);
    navigate(`${ROUTES.CORRESPONDENCE.ARCHIVED.ALL}/${router.id}`);
  };
  const handleUnarchive = (router_id: number) => {
    console.log('Recibir', router_id);
  };
  // ── Render ───────────────────────────────────────────────────
  return (
    <>
      <PageMeta title={`Archivados | ${APP_NAME}`} description="Documentos pendientes de atención" />
      <PageBreadCrumb pageTitle="Archivados" />

      <div className="space-y-5">
        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <ArchivedFilter
            filters={filters}
            sort={sort}
            onFiltersChange={setFilters}
            onSortChange={setSort}
            onReset={resetFilters}
          />
        </div>

        {/* Tabla */}
        <ArchivedTable
          routers={filteredRouters}
          isLoading={isLoading}
          onUnarchive={handleUnarchive}
          onViewRoutes={handleViewRoutes}
          onView={handleView}
        />
      </div>
    </>
  );
}
