import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { CreateDocumentRequest, Document, UpdateDocumentRequest } from '../../types/documents/document.type.ts';
import PageMeta from '../../../common/PageMeta.tsx';
import { APP_NAME } from '../../constants/correspondence.constants.ts';
import PageBreadCrumb from '../../../common/PageBreadCrumb.tsx';
import { ROUTES } from '../../../../constants/routes.constants.ts';
import Tooltip from '../../../form/Tooltip.tsx';
import Button from '../../../ui/button/Button.tsx';
import { PencilIcon, PrinterIcon, SendHorizontalIcon, TrashBinIcon } from '../../../../icons';
import MyDocumentInfo from '../../components/documents/my-documents/MyDocumentInfo.tsx';
import { RouterRoutes } from '../../components/shared/RouterRoutes.tsx';
import { useDocument } from '../../hooks/useDocument.ts';
import { Modal } from '../../../ui/modal';
import DocumentForm from '../../components/documents/my-documents/DocumentForm.tsx';
import RouterForm from '../../components/documents/my-documents/RouterForm.tsx';
import ModalDelete from '../../../modal/ModalDelete.tsx';
import { usePermissions } from '../../../../hooks/usePermissions.ts';
import { useNotifications } from '../../../../hooks/useNotification.tsx';

export default function MyDocumentShowPage() {
  const { id } = useParams();
  const { can } = usePermissions();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const { getById: getDocumentById } = useDocument();

  const [document, setDocument] = useState<Document | null>(null);

  const [isLoadingDocument, setIsLoadingDocument] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRouterModalOpen, setIsRouterModalOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const fetchDocument = useCallback(async () => {
    if (!id) return;
    setIsLoadingDocument(true);
    try {
      const response = await getDocumentById(Number(id), { included: ['routers'] });
      setDocument(response);
    } finally {
      setIsLoadingDocument(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  // ── Handlers ────────────────────────────────────────────────
  const handleViewSheet = () => {
    console.log('Hoja de ruta', document);
  };
  async function handleConfirmDelete() {
    if (confirmId === null) return;
    try {
      addNotification({
        type: 'success',
        title: 'Documento eliminado',
        message: 'El documento fue eliminado correctamente.',
      });
      setConfirmId(null);
      await fetchDocument();
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
      addNotification({
        type: 'info',
        title: 'Documento actualizado',
        message: `El documento "${data.doc_numero_cite}" fue actualizado correctamente.`,
      });

      setIsModalOpen(false);
      await fetchDocument();
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

  return (
    <>
      <PageMeta title={`Trámite #${id} | ${APP_NAME}`} description="Información detallada de mi tramite" />

      <PageBreadCrumb
        pageTitle={`Trámite #${id}`}
        items={[
          {
            label: 'Mis trámites',
            path: ROUTES.DOCUMENTS.MY_DOCUMENTS.ALL,
          },
          {
            label: `#${id}`,
          },
        ]}
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div></div>
        <div>
          <Tooltip content="Hoja de ruta">
            <Button
              className="mr-3"
              variant="secondary"
              size="sm"
              startIcon={<PrinterIcon className="size-3.5" />}
              onClick={() => handleViewSheet()}
            >
              Hoja de ruta
            </Button>
          </Tooltip>
          <Tooltip content="Editar">
            <Button
              className="mr-3"
              variant="action"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              startIcon={<PencilIcon className="size-3.5" />}
            >
              Editar
            </Button>
          </Tooltip>
          <Tooltip content="Derivar">
            <Button
              className="mr-3"
              variant="success"
              size="sm"
              startIcon={<SendHorizontalIcon className="size-3.5" />}
              onClick={() => setIsRouterModalOpen(true)}
            >
              Derivar
            </Button>
          </Tooltip>
          <Tooltip content="Eliminar">
            <Button
              variant="danger"
              size="sm"
              startIcon={<TrashBinIcon className="size-3.5" />}
              onClick={() => setConfirmId(document?.id)}
            >
              Eliminar
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <MyDocumentInfo document={document} isLoading={isLoadingDocument} />
        </div>

        <div className="xl:col-span-2">
          <RouterRoutes document={document} isLoading={isLoadingDocument} />
        </div>
      </div>

      {/********************************** MODALES ***********************************/}
      <Modal
        isOpen={isModalOpen}
        size="lg"
        onClose={() => setIsModalOpen(false)}
        className="w-full max-w-6xl p-6 sm:p-8"
      >
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Editar Documento</h3>
        <p className="mb-5 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
          Los campos marcados con <span className="text-error-500"> * </span> son obligatorios
        </p>
        <DocumentForm document={document} onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>

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
        <RouterForm document={document} onSubmit={handleSubmitRouter} onCancel={() => setIsRouterModalOpen(false)} />
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
