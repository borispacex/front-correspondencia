import { usePermissions } from '../../../../hooks/usePermissions.ts';
import { ATTENDED_STATE_IDS } from '../../components/router/RouterStatusTabs.tsx';
import { useNotifications } from '../../../../hooks/useNotification.tsx';
import { useRouterPage } from '../../hooks/useRouterPage.ts';
import { useState } from 'react';
import { SignFile } from '../../types/sign-file.type.ts';
import { Document } from '../../types/documents/document.type.ts';
import PageMeta from '../../../common/PageMeta.tsx';
import PageBreadCrumb from '../../../common/PageBreadCrumb.tsx';
import { RouterFilter } from '../../components/router/RouterFilter.tsx';
import RouterTable from '../../components/router/RouterTable.tsx';
import { Modal } from '../../../ui/modal';
import RouterForm from '../../components/router/RouterForm.tsx';
import ModalDelete from '../../../modal/ModalDelete.tsx';
import { APP_NAME } from '../../constants/correspondence.constants.ts';
import { ROUTES } from '../../../../constants/routes.constants.ts';
import { useNavigate } from 'react-router';

const isAttended = (stateId: number) => ATTENDED_STATE_IDS.includes(stateId);

export default function RouterAttendedPage() {
  const { can } = usePermissions();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const { documents, isLoading, filters, setFilters, sort, setSort, fetchDocuments } = useRouterPage(isAttended);

  const [isRouterModalOpen, setIsRouterModalOpen] = useState(false);
  const [selected, setSelected] = useState<Document | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  // ── Handlers ────────────────────────────────────────────────
  const handleViewRoutes = (document: Document) => {
    console.log('Rutas:', document);
  };
  const handleView = (document: Document) => {
    console.log('Ver tramite', document);
    navigate(`${ROUTES.CORRESPONDENCE.ROUTE_SHEET.ATTENDED}/${document.id}`);
  };

  async function handleSubmitRouter(data: any) {
    console.log('derive', data);
  }

  async function handleConfirmDelete() {
    if (confirmId === null) return;
    try {
      addNotification({
        type: 'success',
        title: 'Documento eliminado',
        message: 'El documento fue eliminado correctamente.',
      });
      setConfirmId(null);
      fetchDocuments();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message ?? 'Error al eliminar el documento',
      });
    }
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <>
      <PageMeta title={`Bandeja de Salida | ${APP_NAME}`} description="Documentos atendidos / derivados" />
      <PageBreadCrumb pageTitle="Bandeja de Salida" />

      <div className="space-y-5">
        {/* Indicador de estado */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300">
            <span className="size-2 rounded-full bg-green-500" />
            Atendidos · {documents.length}
          </span>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <RouterFilter filters={filters} sort={sort} onFiltersChange={setFilters} onSortChange={setSort} />
        </div>

        {/* Tabla */}
        <RouterTable documents={documents} isLoading={isLoading} onViewRoutes={handleViewRoutes} onView={handleView} />
      </div>
    </>
  );
}
