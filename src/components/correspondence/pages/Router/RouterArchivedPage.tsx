// ─────────────────────────────────────────────────────────────
// RouterArchivedPage.tsx — Archivados
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';

import { ARCHIVED_STATE_IDS } from '../../components/router/RouterStatusTabs.tsx';
import { usePermissions } from '../../../../hooks/usePermissions.ts';
import { useNotifications } from '../../../../hooks/useNotification.tsx';
import { useRouterPage } from '../../hooks/useRouterPage.ts';
import { SignDocument } from '../../types/sign-document.type.ts';
import { Document } from '../../types/documents/document.type.ts';
import PageMeta from '../../../common/PageMeta.tsx';
import PageBreadCrumb from '../../../common/PageBreadCrumb.tsx';
import { RouterFilter } from '../../components/router/RouterFilter.tsx';
import RouterTable from '../../components/router/RouterTable.tsx';
import { Modal } from '../../../ui/modal';
import RouterForm from '../../components/router/RouterForm.tsx';
import ModalDelete from '../../../modal/ModalDelete.tsx';
import { APP_NAME } from '../../constants/correspondence.constants.ts';

const isArchived = (stateId: number) => ARCHIVED_STATE_IDS.includes(stateId);

export default function RouterArchivedPage() {
  const { can } = usePermissions();
  const { addNotification } = useNotifications();

  const { documents, isLoading, filters, setFilters, sort, setSort, fetchDocuments } = useRouterPage(isArchived);

  const [isRouterModalOpen, setIsRouterModalOpen] = useState(false);
  const [selected, setSelected] = useState<Document | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  // ── Handlers ────────────────────────────────────────────────
  const handleRouter = (document: Document) => {
    setSelected(document);
    setIsRouterModalOpen(true);
  };
  const handleViewHeader = (document: Document) => console.log('Cabecera:', document);
  const handleViewSheet = (document: Document) => console.log('Hoja:', document);
  const handleViewRoutes = (document: Document) => console.log('Rutas:', document);
  const handleView = (document: SignDocument) => console.log('Ver documento', document);

  function handleEdit(document: Document) {
    setSelected(document);
  }
  function handleDelete(id: number) {
    setConfirmId(id);
  }
  const handleToggleActive = (item: Document, active: boolean) => {
    console.log('toggleActive', item, active);
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
      <PageMeta title={`Archivados | ${APP_NAME}`} description="Documentos archivados" />
      <PageBreadCrumb pageTitle="Archivados" />

      <div className="space-y-5">
        {/* Indicador de estado */}
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
        <RouterTable
          documents={documents}
          isLoading={isLoading}
          selectedDocumentId={selected?.id}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onDerive={can('documents.derive') ? handleRouter : undefined}
          onViewHeader={can('documents.edit') ? handleViewHeader : undefined}
          onViewSheet={can('documents.edit') ? handleViewSheet : undefined}
          onViewRoutes={can('documents.routes') ? handleViewRoutes : undefined}
          onView={handleView}
        />
      </div>

      {/* Modal derivar */}
      <Modal
        isOpen={isRouterModalOpen}
        size="lg"
        onClose={() => setIsRouterModalOpen(false)}
        className="w-full max-w-6xl p-6 sm:p-8"
      >
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Derivar documento</h3>
        <p className="mb-5 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
          Los campos marcados con <span className="text-error-500"> * </span> son obligatorios
        </p>
        <RouterForm document={selected} onSubmit={handleSubmitRouter} onCancel={() => setIsRouterModalOpen(false)} />
      </Modal>

      <ModalDelete
        isOpen={confirmId !== null}
        onClose={() => setConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar este Documento?"
        message="Esta acción no se puede deshacer."
      />
    </>
  );
}
