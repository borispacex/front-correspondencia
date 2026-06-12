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
import { ForwardIcon, PrinterIcon, RouteIcon } from '../../../../icons';
import { RouterRoutes } from '../../components/shared/RouterRoutes.tsx';
import OutboxInfo from '../../components/mailbox/outbox/OutboxInfo.tsx';
import RouterRoutesModal from '../../components/shared/RouterRoutesModal.tsx';
import ConfirmModal from '../../../modal/ModalConfirm.tsx';
import { usePermissions } from '../../../../hooks/usePermissions.ts';
import { useNotifications } from '../../../../hooks/useNotification.tsx';

export default function OutboxShowPage() {
  const { id } = useParams();

  const { can } = usePermissions();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [router, setRouter] = useState<Router | null>(null);
  const [isLoadingRouter, setIsLoadingRouter] = useState(false);

  const [openRoutesModal, setOpenRoutesModal] = useState(false);
  const [openForwardModal, setOpenForwardModal] = useState(false);

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
  const handleForward = () => {
    setOpenForwardModal(true);
  };

  const handleBackup = () => {
    console.log('Respaldo:', router?.id);
  };

  const handleViewRoutes = () => {
    setOpenRoutesModal(true);
  };

  async function handleConfirmForward() {
    if (router === null) return;
    try {
      // await forwardRoute(route.id)
      addNotification({
        type: 'success',
        title: 'Reenvio exitoso',
        message: 'El reenvió fue enviado correctamente.',
      });
      navigate(`${ROUTES.MAILBOX.OUTBOX.ALL}}`);
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message ?? 'Error al realizar reenvio',
      });
    }
  }

  return (
    <>
      <PageMeta title={`Tramite (Derivación) #${id} | ${APP_NAME}`} description="Información detallada del trámite" />

      <PageBreadCrumb
        pageTitle={`Tramite (Derivación) #${id}`}
        items={[
          {
            label: 'Bandeja de Salida',
            path: ROUTES.MAILBOX.OUTBOX.ALL,
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
              onClick={() => handleViewRoutes()}
              startIcon={<RouteIcon className="size-3.5" />}
            >
              Ver rutas
            </Button>
          </Tooltip>
          <Tooltip content="Respaldo">
            <Button
              className="mr-3"
              variant="secondary"
              size="sm"
              startIcon={<PrinterIcon className="size-3.5" />}
              onClick={() => handleBackup()}
            >
              Respaldo
            </Button>
          </Tooltip>
          <Tooltip content="Reenviar">
            <Button
              variant="info"
              size="sm"
              startIcon={<ForwardIcon className="size-3.5" />}
              onClick={() => handleForward()}
            >
              Reenviar
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <OutboxInfo router={router} isLoading={isLoadingRouter} />
        </div>

        <div className="xl:col-span-2">
          <RouterRoutes document={router?.document} isLoading={isLoadingRouter} />
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
        isOpen={openForwardModal}
        variant="success"
        title="¿Confirmar reenvio?"
        message="Se realizará el reenvio de la derivación."
        confirmText="Reenviar"
        loadingText="Reenviando"
        onClose={() => setOpenForwardModal(false)}
        onConfirm={handleConfirmForward}
      />
    </>
  );
}
