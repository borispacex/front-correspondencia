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
import { ArchiveRestoreIcon, RouteIcon } from '../../../../icons';
import ArchivedInfo from '../../components/correspondence/archived/ArchivedInfo.tsx';
import RouterRoutesModal from '../../components/shared/RouterRoutesModal.tsx';
import ConfirmModal from '../../../modal/ModalConfirm.tsx';
import { usePermissions } from '../../../../hooks/usePermissions.ts';
import { useNotifications } from '../../../../hooks/useNotification.tsx';

export default function ArchivedShowPage() {
  const { id } = useParams();

  const { can } = usePermissions();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [router, setRouter] = useState<Router | null>(null);
  const [isLoadingRouter, setIsLoadingRouter] = useState(false);

  const [openRoutesModal, setOpenRoutesModal] = useState(false);
  const [openUnarchiveModal, setOpenUnarchiveModal] = useState(false);

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
  async function handleConfirmUnarchive() {
    if (router === null) return;
    try {
      // await unarchiveRoute(route.id)
      addNotification({
        type: 'success',
        title: 'Dearchivado exitosa',
        message: 'La desarchivado fue exitoso correctamente.',
      });
      navigate(`${ROUTES.CORRESPONDENCE.ARCHIVED.ALL}}`);
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err?.response?.data?.message ?? 'Error al realizar desarchivación',
      });
    }
  }

  return (
    <>
      <PageMeta
        title={`Tramite (Derivación) #${id} | ${APP_NAME}`}
        description="Información detallada del tramite archivado"
      />
      <PageBreadCrumb
        pageTitle={`Tramite (Derivación) #${id}`}
        items={[
          {
            label: 'Archivados',
            path: ROUTES.CORRESPONDENCE.ARCHIVED.ALL,
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
          <Tooltip content="Desarchivar">
            <Button
              variant="info"
              size="sm"
              startIcon={<ArchiveRestoreIcon className="size-3.5" />}
              onClick={() => setOpenUnarchiveModal(true)}
            >
              Desarchivar
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <ArchivedInfo router={router} isLoading={isLoadingRouter} />
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
        isOpen={openUnarchiveModal}
        variant="success"
        title="¿Confirmar desarchivar?"
        message="Se realizará desarchivar de la derivación."
        confirmText="Desarchivar"
        loadingText="Desarchivando"
        onClose={() => setOpenUnarchiveModal(false)}
        onConfirm={handleConfirmUnarchive}
      />
    </>
  );
}
