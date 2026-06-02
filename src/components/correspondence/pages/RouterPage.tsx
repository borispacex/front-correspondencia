import { useEffect, useMemo, useState } from 'react';
import { SignDocument, SignDocumentFilters, SignDocumentSortConfig } from '../types/sign-document.type.ts';
import { usePermissions } from '../../../hooks/usePermissions.ts';
import { useNotifications } from '../../../hooks/useNotification.tsx';
import PageMeta from '../../common/PageMeta.tsx';
import PageBreadCrumb from '../../common/PageBreadCrumb.tsx';
import Button from '../../ui/button/Button.tsx';
import { PlusIcon } from '../../../icons';
import { Modal } from '../../ui/modal';
import RouterTable from '../components/router/RouterTable.tsx';
import RouterFilter from '../components/router/RouterFilter.tsx';
import { CreateDocumentRequest, Document, UpdateDocumentRequest } from '../types/documents/document.type.ts';
import DocumentForm from '../components/documents/DocumentForm.tsx';
import RouterForm from '../components/router/RouterForm.tsx';

const SIGN_DOCUMENTS: SignDocument[] = [
  {
    id: 11,
    code: 'EMI/DGE/UGAT/AIT/001/2025',
    subject: 'Solicitud de revisión técnica',
    documentType: 'Nota externa ciudadana',
    createdAt: '18/06/2025',
    actionPerformed: 'Revisé como DE',
    status: 'pending_approval',
    route: {
      id: 10,
      code: 'HRD/EMI/00062/2025',
      subject: 'Revisión hoja de ruta',
    },
    actions: [
      {
        type: 'approve',
        enabled: true,
      },
      {
        type: 'traceability',
        enabled: true,
      },
    ],
  },
  {
    id: 2,
    code: 'EMI/DGE/UGAT/AIT/001/2025',
    subject: 'Solicitud de revisión pago',
    documentType: 'Nota interna',
    createdAt: '15/01/2026',
    actionPerformed: 'Revisé como Director',
    status: 'pending_approval',
    route: {
      id: 11,
      code: 'HRD/EMI/00062/2025',
      subject: 'Revisión hoja de ruta',
    },
    actions: [
      {
        type: 'approve',
        enabled: false,
      },
      {
        type: 'traceability',
        enabled: true,
      },
    ],
  },
];

export default function RouterPage() {
  const { can } = usePermissions();
  const { addNotification } = useNotifications();
  const [selected, setSelected] = useState<Document | null>(null);

  const [documents, setDocuments] = useState<SignDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRouterModalOpen, setIsRouterModalOpen] = useState(false);

  const [filters, setFilters] = useState<SignDocumentFilters>({
    code: '',
    route: '',
    subject: '',
    status: '',
    createdAt: '',
  });

  const [sort, setSort] = useState<SignDocumentSortConfig>({
    field: 'created_at',
    dir: 'desc',
  });

  // ─────────────────────────────────────────────
  // Load data
  // ─────────────────────────────────────────────

  async function loadDocuments() {
    setIsLoading(true);

    try {
      // const data = await getPendingSignDocuments();
      // setDocuments(data);
      setDocuments(SIGN_DOCUMENTS);
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message ?? 'Error al cargar documentos',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  // ─────────────────────────────────────────────
  // Filters + Sort
  // ─────────────────────────────────────────────

  const filteredDocuments = useMemo(() => {
    const filtered = documents.filter((document) => {
      const codeMatch = !filters.code || String(document.code).toLowerCase().includes(filters.code.toLowerCase());

      const routeMatch = !filters.route || String(document.route).toLowerCase().includes(filters.route.toLowerCase());

      const subjectMatch =
        !filters.subject || String(document.subject).toLowerCase().includes(filters.subject.toLowerCase());

      const statusMatch =
        !filters.status || String(document.status).toLowerCase().includes(filters.status.toLowerCase());

      const createdAtMatch = !filters.createdAt || String(document.createdAt).includes(filters.createdAt);

      return codeMatch && routeMatch && subjectMatch && statusMatch && createdAtMatch;
    });

    return [...filtered].sort((a, b) => {
      const aVal = String(a[sort.field as keyof SignDocument] ?? '');

      const bVal = String(b[sort.field as keyof SignDocument] ?? '');

      const cmp = aVal.localeCompare(bVal, undefined, {
        numeric: true,
        sensitivity: 'base',
      });

      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [documents, filters, sort]);

  // ─────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────

  async function handleApprove(document: SignDocument) {
    setIsModalOpen(true);
    // setSelecteds();
  }

  async function handleReject(document: SignDocument) {
    try {
      // await rejectSignDocument(document.id);

      addNotification({
        type: 'warning',
        title: 'Documento rechazado',
        message: `El documento "${document.code}" fue rechazado.`,
      });

      await loadDocuments();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message ?? 'Error al rechazar documento',
      });
    }
  }

  async function handleSign(document: SignDocument) {
    try {
      // await signDocument(document.id);

      addNotification({
        type: 'success',
        title: 'Documento firmado',
        message: `El documento "${document.code}" fue firmado digitalmente.`,
      });

      await loadDocuments();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message ?? 'Error al firmar documento',
      });
    }
  }

  function handleView(document: SignDocument) {
    console.log('Ver documento', document);
  }

  function handleViewRoute(document: SignDocument) {
    console.log('Ver hoja de ruta', document);
  }

  function handleViewRoute(document: SignDocument) {
    console.log('Ver hoja de ruta', document);
  }

  function handleApproveDocuments(document: SignDocument) {
    console.log('Ver hoja de ruta', document);
    // setSelecteds(documents);
    setIsModalOpen(true);
  }

  function handleCreate() {
    setSelected(null);
    setIsModalOpen(true);
  }

  async function handleSubmit(data: CreateDocumentRequest | UpdateDocumentRequest) {
    try {
      if (selected) {
        // await updateDocument(selected.id, data as UpdateDocumentRequest);

        addNotification({
          type: 'info',
          title: 'Documento actualizado',
          message: `El documento "${data.doc_numero_cite}" fue actualizado correctamente.`,
        });
      } else {
        // await createDocument(data as CreateDocumentRequest);

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

  async function handleSubmitRouter(data: any) {
    console.log('derive', data);
  }

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  return (
    <>
      <PageMeta title="Hoja de ruta" description="Gestión de creación de hoja de ruta" />

      <PageBreadCrumb pageTitle="Hoja de ruta" />

      <div className="space-y-5">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <RouterFilter filters={filters} sort={sort} onFiltersChange={setFilters} onSortChange={setSort} />
          {can('documents.create') && (
            <Button size="sm" onClick={handleCreate} startIcon={<PlusIcon className="size-4 text-white" />}>
              Nuevo Tramite
            </Button>
          )}
        </div>

        {/* Table */}
        <RouterTable
          documents={filteredDocuments}
          isLoading={isLoading}
          onApprove={handleApprove}
          onReject={handleReject}
          onSign={handleSign}
          onView={handleView}
          onViewRoute={handleViewRoute}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        size="lg"
        onClose={() => setIsModalOpen(false)}
        className="w-full max-w-6xl p-6 sm:p-8"
      >
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          {selected ? 'Editar Tramite' : 'Nuevo Tramite'}
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
    </>
  );
}
