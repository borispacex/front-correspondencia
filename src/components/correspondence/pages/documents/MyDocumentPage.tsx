import { usePermissions } from '../../../../hooks/usePermissions.ts';
import { useNotifications } from '../../../../hooks/useNotification.tsx';
import { useCallback, useEffect, useState } from 'react';
import { CreateDocumentRequest, UpdateDocumentRequest, Document } from '../../types/documents/document.type.ts';
import PageMeta from '../../../common/PageMeta.tsx';
import PageBreadCrumb from '../../../common/PageBreadCrumb.tsx';
import Button from '../../../ui/button/Button.tsx';
import { PlusIcon } from '../../../../icons';
import { Modal } from '../../../ui/modal';
import ModalDelete from '../../../modal/ModalDelete.tsx';
import { APP_NAME } from '../../constants/correspondence.constants.ts';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../../../constants/routes.constants.ts';
import DocumentForm from '../../components/documents/my-documents/DocumentForm.tsx';
import RouterForm from '../../components/documents/my-documents/RouterForm.tsx';
import { MyDocumentFilter } from '../../components/documents/my-documents/MyDocumentFilter.tsx';
import MyDocumentTable from '../../components/documents/my-documents/MyDocumentTable.tsx';
import { useDocument } from '../../hooks/useDocument.ts';
import { useMyDocumentFilters } from '../../hooks/filters/useMyDocumentFilters.ts';

export default function MyDocumentPage() {
  const { can } = usePermissions();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const { documents, isLoading, getAll } = useDocument();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRouterModalOpen, setIsRouterModalOpen] = useState(false);
  const [selected, setSelected] = useState<Document | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  // ──────────────────────────── filters ─────────────────────────────────
  const { filters, setFilters, sort, setSort, resetFilters, filteredDocuments } = useMyDocumentFilters(documents);
  // ──────────────────────────── Load data ─────────────────────────────────
  const fetchDocuments = useCallback(async () => {
    await getAll();
  }, [getAll]);
  useEffect(() => {
    getAll();
  }, [getAll]);
  // ─────────────────────────── Handlers ──────────────────────────────────
  const handleDerive = (document: Document) => {
    setSelected(document);
    setIsRouterModalOpen(true);
  };
  const handleViewHeader = (document: Document) => {
    console.log('Cabecera:', document);
  };
  const handleViewSheet = (document: Document) => {
    console.log('Hoja:', document);
  };
  const handleView = (document: Document) => {
    console.log('Ver tramite', document);
    navigate(`${ROUTES.DOCUMENTS.MY_DOCUMENTS.ALL}/${document.id}`);
  };

  function handleEdit(document: Document) {
    setSelected(document);
    setIsModalOpen(true);
  }
  function handleDelete(id: number) {
    setConfirmId(id);
  }
  function handleCreate() {
    setSelected(null);
    setIsModalOpen(true);
  }
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

  async function handleSubmit(data: CreateDocumentRequest | UpdateDocumentRequest) {
    try {
      if (selected) {
        addNotification({
          type: 'info',
          title: 'Documento actualizado',
          message: `El documento "${data.doc_numero_cite}" fue actualizado correctamente.`,
        });
      } else {
        addNotification({
          type: 'success',
          title: 'Documento creado',
          message: `El documento "${data.doc_numero_cite}" fue creado correctamente.`,
        });
      }
      setIsModalOpen(false);
      fetchDocuments();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message ?? 'Error al guardar el usuario',
      });
    }
  }
  // ───────────────────────── Render ────────────────────────────────────
  return (
    <>
      <PageMeta title={`Mis Trámites | ${APP_NAME}`} description="Gestión de creación de tramites" />
      <PageBreadCrumb pageTitle="Mis trámites" />

      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <MyDocumentFilter
            filters={filters}
            sort={sort}
            onFiltersChange={setFilters}
            onSortChange={setSort}
            onReset={resetFilters}
          />
          {can('files.create') && (
            <Button size="sm" onClick={handleCreate} startIcon={<PlusIcon className="size-4 text-white" />}>
              Nuevo Trámite
            </Button>
          )}
        </div>

        <MyDocumentTable
          documents={filteredDocuments}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDerive={handleDerive}
          onViewHeader={handleViewHeader}
          onViewSheet={handleViewSheet}
          onView={handleView}
        />
      </div>

      {/********************************** MODALES ***********************************/}
      <Modal
        isOpen={isModalOpen}
        size="lg"
        onClose={() => setIsModalOpen(false)}
        className="w-full max-w-6xl p-6 sm:p-8"
      >
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          {selected ? 'Editar Documento' : 'Nuevo Documento'}
        </h3>
        <p className="mb-5 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
          Los campos marcados con <span className="text-error-500"> * </span> son obligatorios
        </p>
        <DocumentForm document={selected} onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isRouterModalOpen}
        size="lg"
        onClose={() => setIsRouterModalOpen(false)}
        className="w-full max-w-6xl p-6 sm:p-8"
      >
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          {selected ? 'Editar documento derivado' : 'Derivar documento'}
        </h3>
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
