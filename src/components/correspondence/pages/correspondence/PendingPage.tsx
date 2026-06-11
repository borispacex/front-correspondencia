import { usePermissions } from '../../../../hooks/usePermissions.ts';
import { useNotifications } from '../../../../hooks/useNotification.tsx';
import PageMeta from '../../../common/PageMeta.tsx';
import PageBreadCrumb from '../../../common/PageBreadCrumb.tsx';
import { APP_NAME } from '../../constants/correspondence.constants.ts';
import { ROUTES } from '../../../../constants/routes.constants.ts';
import { useNavigate } from 'react-router';
import { PendingFilter } from '../../components/correspondence/pending/PendingFilter.tsx';
import PendingTable from '../../components/correspondence/pending/PendingTable.tsx';
import { useCallback, useEffect } from 'react';
import { useRouter } from '../../hooks/useRouter.ts';
import { usePendingFilters } from '../../hooks/filters/usePendingFilters.ts';
import { Router } from '../../types/routers/router.type.ts';
import { STATE } from '../../constants/state-document.constants.ts';

export default function PendingPage() {
  const { can } = usePermissions();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const { routers, isLoading, getAll } = useRouter();

  // ──────────────────────────── filters ─────────────────────────────────
  const { filters, setFilters, sort, setSort, resetFilters, filteredRouters } = usePendingFilters(routers);
  // ──────────────────────────── Load data ─────────────────────────────────
  const fetchRouters = useCallback(async () => {
    await getAll({
      included: ['document'],
      filter: { state_document_id: [STATE.ENVIADO, STATE.DERIVADO] },
    });
  }, [getAll]);
  useEffect(() => {
    getAll({ included: ['document'], filter: { state_document_id: [STATE.ENVIADO, STATE.DERIVADO] } });
  }, [getAll]);

  // ── Handlers ────────────────────────────────────────────────
  const handleViewRoutes = (router: Router) => {
    console.log('Rutas:', router);
  };
  const handleView = (router: Router) => {
    console.log('Ver documento', router);
    navigate(`${ROUTES.CORRESPONDENCE.PENDING.ALL}/${router.id}`);
  };
  // ── Render ───────────────────────────────────────────────────
  return (
    <>
      <PageMeta title={`Sin acción | ${APP_NAME}`} description="Documentos pendientes de atención" />
      <PageBreadCrumb pageTitle="Sin acción" />

      <div className="space-y-5">
        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <PendingFilter
            filters={filters}
            sort={sort}
            onFiltersChange={setFilters}
            onSortChange={setSort}
            onReset={resetFilters}
          />
        </div>

        {/* Tabla */}
        <PendingTable
          routers={filteredRouters}
          isLoading={isLoading}
          onViewRoutes={handleViewRoutes}
          onView={handleView}
        />
      </div>
    </>
  );
}
