import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Router } from '../../types/routers/router.type.ts';
import { getRouterById } from '../../services/router.service.ts';
import PageMeta from '../../../common/PageMeta.tsx';
import { APP_NAME } from '../../constants/correspondence.constants.ts';
import PageBreadCrumb from '../../../common/PageBreadCrumb.tsx';
import { ROUTES } from '../../../../constants/routes.constants.ts';
import Tooltip from '../../../form/Tooltip.tsx';
import Button from '../../../ui/button/Button.tsx';
import { InboxIcon, RouteIcon, TrashBinIcon } from '../../../../icons';
import InboxInfo from '../../components/mailbox/inbox/InboxInfo.tsx';
import RouterRoutesModal from '../../components/shared/RouterRoutesModal.tsx';
import ConfirmModal from '../../../modal/ModalConfirm.tsx';
import { usePermissions } from '../../../../hooks/usePermissions.ts';
import { useNotifications } from '../../../../hooks/useNotification.tsx';
import ModalDelete from '../../../modal/ModalDelete.tsx';

export default function InboxShowPage() {
  const { id } = useParams();

  const { can } = usePermissions();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [router, setRouter] = useState<Router | null>(null);
  const [isLoadingRouter, setIsLoadingRouter] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openRoutesModal, setOpenRoutesModal] = useState(false);
  const [openReceiveModal, setOpenReceiveModal] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoadingRouter(true);
    try {
      const response = await getRouterById(Number(id), {
        included: ['document.routers'],
      });
      setRouter(response);
    } finally {
      setIsLoadingRouter(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Handlers ────────────────────────────────────────────────
  async function handleConfirmDelete() {
    if (router === null) return;
    try {
      // await deleteRoute(route.id)
      addNotification({
        type: 'success',
        title: 'Derivación eliminada',
        message: 'La derivación fue eliminada correctamente.',
      });
      navigate(`${ROUTES.MAILBOX.INBOX.ALL}}`);
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message ?? 'Error al eliminar derivación',
      });
    }
  }

  async function handleConfirmReceive() {
    if (router === null) return;
    try {
      // await deriveRoute(route.id)
      addNotification({
        type: 'success',
        title: 'Derivación exitosa',
        message: 'La derivación fue enviada correctamente.',
      });
      navigate(`${ROUTES.MAILBOX.INBOX.ALL}}`);
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message ?? 'Error al realizar derivación',
      });
    }
  }

  return (
    <>
      <PageMeta
        title={`Tramite (Derivación) #${id} | ${APP_NAME}`}
        description="Información detallada del trámite pendiente"
      />

      <PageBreadCrumb
        pageTitle={`Tramite (Derivación) #${id}`}
        items={[
          {
            label: 'Bandeja de entrada',
            path: ROUTES.MAILBOX.INBOX.ALL,
          },
          {
            label: `#${id}`,
          },
        ]}
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div></div>
        <div>
          <Tooltip content="Ver rutas">
            <Button
              className="mr-3"
              variant="primary"
              size="sm"
              onClick={() => setOpenRoutesModal(true)}
              startIcon={<RouteIcon className="size-3.5" />}
            >
              Ver rutas
            </Button>
          </Tooltip>
          <Tooltip content="Recibir">
            <Button
              className="mr-3"
              variant="info"
              size="sm"
              startIcon={<InboxIcon className="size-3.5" />}
              onClick={() => setOpenReceiveModal(true)}
            >
              Recibir
            </Button>
          </Tooltip>
          <Tooltip content="Eliminar">
            <Button
              variant="danger"
              size="sm"
              startIcon={<TrashBinIcon className="size-3.5" />}
              onClick={() => setOpenDeleteModal(true)}
            >
              Eliminar
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <InboxInfo router={router} isLoading={isLoadingRouter} />
        </div>

        <div className="xl:col-span-2">
          {/*<RouterRoutes document={router?.document} isLoading={isLoadingRouter} />*/}
          <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <iframe
              src="https://drive.google.com/file/d/1HlKslqmKv3p4PE8ajFx9sZ43_FbH6szT/preview"
              className="h-[80vh] w-full rounded-xl"
              allow="autoplay"
              title="Documento"
            />
          </div>
        </div>
      </div>

      {/********************************** MODALES ***********************************/}
      <RouterRoutesModal
        isOpen={openRoutesModal}
        isLoading={isLoadingRouter}
        onClose={() => setOpenRoutesModal(false)}
        document={router?.document}
      />
      <ConfirmModal
        isOpen={openReceiveModal}
        variant="success"
        title="¿Confirmar recepción?"
        message="Se realizará la recepción de la derivación."
        confirmText="Recibir"
        loadingText="Recibiendo"
        onClose={() => setOpenReceiveModal(false)}
        onConfirm={handleConfirmReceive}
      />

      <ModalDelete
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar este derivación?"
        message="Esta acción no se puede deshacer."
      />
    </>
  );
}
