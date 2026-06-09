import { usePermissions } from '../../../../hooks/usePermissions.ts';
import { useNotifications } from '../../../../hooks/useNotification.tsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CreateDocumentRequest,
  DocumentFilters,
  UpdateDocumentRequest,
  Document,
} from '../../types/documents/document.type.ts';
import { RouterFilter, SortConfig } from '../../components/router/RouterFilter.tsx';
import RouterStatusTabs, {
  ARCHIVED_STATE_IDS,
  ATTENDED_STATE_IDS,
  PENDING_STATE_IDS,
  RouterStatusTab,
} from '../../components/router/RouterStatusTabs.tsx';
import { getDocuments } from '../../services/document.service.ts';
import PageMeta from '../../../common/PageMeta.tsx';
import PageBreadCrumb from '../../../common/PageBreadCrumb.tsx';
import Button from '../../../ui/button/Button.tsx';
import { PlusIcon } from '../../../../icons';
import RouterTable from '../../components/router/RouterTable.tsx';
import { Modal } from '../../../ui/modal';
import FileForm from '../../components/files/FileForm.tsx';
import RouterForm from '../../components/router/RouterForm.tsx';
import ModalDelete from '../../../modal/ModalDelete.tsx';
import { APP_NAME } from '../../constants/correspondence.constants.ts';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../../../constants/routes.constants.ts';

export default function AllDocumentPage() {
  const { can } = usePermissions();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRouterModalOpen, setIsRouterModalOpen] = useState(false);
  const [selected, setSelected] = useState<Document | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

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
  const [statusTab, setStatusTab] = useState<RouterStatusTab>('all');

  // ─────────────────────────────────────────────────────────────
  // Conteos para los tabs + contexto global (sidebar)
  // ─────────────────────────────────────────────────────────────
  const tabCounts = useMemo(
    () => ({
      all: documents.length,
      pending: documents.filter((d) => PENDING_STATE_IDS.includes(d.state_document_id)).length,
      attended: documents.filter((d) => ATTENDED_STATE_IDS.includes(d.state_document_id)).length,
      archived: documents.filter((d) => ARCHIVED_STATE_IDS.includes(d.state_document_id)).length,
    }),
    [documents],
  );

  // ─────────────────────────────────────────────────────────────
  // Filtered data
  // ─────────────────────────────────────────────────────────────
  const filteredDocuments = useMemo(() => {
    const filtered = documents.filter((document) => {
      if (statusTab === 'pending' && !PENDING_STATE_IDS.includes(document.state_document_id)) return false;
      if (statusTab === 'attended' && !ATTENDED_STATE_IDS.includes(document.state_document_id)) return false;
      if (statusTab === 'archived' && !ARCHIVED_STATE_IDS.includes(document.state_document_id)) return false;

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
  const handleDerive = (document: Document) => {
    setSelected(document);
    setIsRouterModalOpen(true);
  };
  const handleViewHeader = (document: Document) => console.log('Cabecera:', document);
  const handleViewSheet = (document: Document) => console.log('Hoja:', document);
  const handleView = (document: Document) => {
    console.log('Ver tramite', document);
    switch (statusTab) {
      case 'all':
        navigate(`${ROUTES.CORRESPONDENCE.ROUTE_SHEET.ALL}/${document.id}`);
        return;
      case 'pending':
        navigate(`${ROUTES.CORRESPONDENCE.ROUTE_SHEET.PENDING}/${document.id}`);
        return;
      case 'attended':
        navigate(`${ROUTES.CORRESPONDENCE.ROUTE_SHEET.ATTENDED}/${document.id}`);
        return;
      case 'archived':
        navigate(`${ROUTES.CORRESPONDENCE.ROUTE_SHEET.ARCHIVED}/${document.id}`);
        return;
    }
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

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <>
      <PageMeta title={`Trámites | ${APP_NAME}`} description="Gestión de creación de tramites" />
      <PageBreadCrumb pageTitle="Trámites" />

      <div className="space-y-5">
        <RouterStatusTabs active={statusTab} counts={tabCounts} onChange={(tab) => setStatusTab(tab)} />

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <RouterFilter filters={filters} sort={sort} onFiltersChange={setFilters} onSortChange={setSort} />
          {can('files.create') && (
            <Button size="sm" onClick={handleCreate} startIcon={<PlusIcon className="size-4 text-white" />}>
              Nuevo Trámite
            </Button>
          )}
        </div>

        <RouterTable
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
        <FileForm document={selected} onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
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
