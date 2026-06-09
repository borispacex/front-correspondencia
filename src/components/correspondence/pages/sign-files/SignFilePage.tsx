import { useEffect, useMemo, useState } from 'react';
import { SignFile, SignFileFilters, SignFileSortConfig } from '../../types/sign-file.type.ts';
import { useNotifications } from '../../../../hooks/useNotification.tsx';
import PageMeta from '../../../common/PageMeta.tsx';
import SignFileFilter from '../../components/sign-files/SignFileFilter.tsx';
import PageBreadCrumb from '../../../common/PageBreadCrumb.tsx';
import SignFileTable from '../../components/sign-files/SignFileTable.tsx';
import { usePermissions } from '../../../../hooks/usePermissions.ts';
import Button from '../../../ui/button/Button.tsx';
import { FingerprintPatternIcon } from '../../../../icons';
import { Modal } from '../../../ui/modal';
import SignFileForm from '../../components/sign-files/SignFileForm.tsx';
import { FileRoutes } from '../../components/files/FileRoutes.tsx';
import { APP_NAME } from '../../constants/correspondence.constants.ts';

const SIGN_DOCUMENTS: SignFile[] = [
  {
    id: 1,
    code: 'EMI/DGE/UGAT/AIT/001/2025',
    subject: 'Solicitud de revisión técnica',
    documentType: 'Nota externa ciudadana',
    createdAt: '18/06/2025',
    actionPerformed: 'Revisé como DE',
    status: 'pending_approval',
    route: {
      id: 10,
      code: 'HRD/EMI/00062/2025',
      subject: 'Revisión trámite',
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
      subject: 'Revisión tramite',
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
];

export default function SignFilePage() {
  const { can } = usePermissions();
  const { addNotification } = useNotifications();
  const [selecteds, setSelecteds] = useState<SignFile | null>(null);

  const [documents, setDocuments] = useState<SignFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalRoutesOpen, setIsRoutesModalOpen] = useState(false);

  const [filters, setFilters] = useState<SignFileFilters>({
    code: '',
    route: '',
    subject: '',
    status: '',
    createdAt: '',
  });

  const [sort, setSort] = useState<SignFileSortConfig>({
    field: 'created_at',
    dir: 'desc',
  });

  // ─────────────────────────────────────────────
  // Load data
  // ─────────────────────────────────────────────

  async function loadDocuments() {
    setIsLoading(true);

    try {
      // const data = await getPendingSignFiles();
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
      const aVal = String(a[sort.field as keyof SignFile] ?? '');

      const bVal = String(b[sort.field as keyof SignFile] ?? '');

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

  async function handleApprove(document: SignFile) {
    setIsModalOpen(true);
    // setSelecteds();
  }

  async function handleReject(document: SignFile) {
    try {
      // await rejectSignFile(document.id);

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

  async function handleSign(document: SignFile) {
    try {
      // await signFile(document.id);

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

  function handleView(document: SignFile) {
    console.log('Ver firma digital', document);
  }

  function handleViewRoute(document: SignFile) {
    console.log('Ver tramite', document);
  }

  function handleViewRoute(document: SignFile) {
    console.log('Ver tramite', document);
    setIsRoutesModalOpen(true);
  }

  function handleApproveDocuments(document: SignFile) {
    console.log('Ver tramite', document);
    // setSelecteds(files);
    setIsModalOpen(true);
  }

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  return (
    <>
      <PageMeta title={`Firma Digital | ${APP_NAME}`} description="Gestión de firma digital" />

      <PageBreadCrumb pageTitle="Firma Digital" />

      <div className="space-y-5">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <SignFileFilter filters={filters} sort={sort} onFiltersChange={setFilters} onSortChange={setSort} />
          {can('files.create') && (
            <Button
              size="sm"
              onClick={() => handleApproveDocuments(null)}
              startIcon={<FingerprintPatternIcon className="size-4 text-white" />}
            >
              Firmar documentos
            </Button>
          )}
        </div>

        {/* Table */}
        <SignFileTable
          documents={filteredDocuments}
          isLoading={isLoading}
          onApprove={handleApprove}
          onReject={handleReject}
          onSign={handleSign}
          onView={handleView}
          onViewRoute={handleViewRoute}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-md p-6 sm:p-8">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Firmador AGETIC</h3>
        <p className="mb-5 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
          Los campos marcados con <span className="text-error-500"> * </span> son obligatorios
        </p>
        <SignFileForm
          SignFiles={selecteds}
          onSuccess={() => {
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
      <Modal isOpen={isModalRoutesOpen} onClose={() => setIsRoutesModalOpen(false)} className="max-w-md p-6 sm:p-8">
        <FileRoutes document={document} isLoading={isLoading} />
      </Modal>
    </>
  );
}
