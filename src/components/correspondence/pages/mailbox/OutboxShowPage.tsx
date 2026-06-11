import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Router } from '../../types/routers/router.type.ts';
import { getRouterById } from '../../services/router.service.ts';
import PageMeta from '../../../common/PageMeta.tsx';
import { APP_NAME } from '../../constants/correspondence.constants.ts';
import PageBreadCrumb from '../../../common/PageBreadCrumb.tsx';
import { ROUTES } from '../../../../constants/routes.constants.ts';
import Tooltip from '../../../form/Tooltip.tsx';
import Button from '../../../ui/button/Button.tsx';
import { ForwardIcon, PrinterIcon, RouteIcon } from '../../../../icons';
import { Document } from '../../types/documents/document.type.ts';
import { RouterRoutes } from '../../components/shared/RouterRoutes.tsx';
import OutboxInfo from '../../components/mailbox/outbox/OutboxInfo.tsx';

export default function OutboxShowPage() {
  const { id } = useParams();

  const [router, setRouter] = useState<Router | null>(null);
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoadingRouter, setIsLoadingRouter] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;

    setIsLoadingRouter(true);
    setIsLoadingHistory(true);

    try {
      const response = await getRouterById(Number(id), {
        included: ['document.routers'],
      });

      setRouter(response);
      // El documento con sus routers viene dentro del router
      setDocument(response.document ?? null);
    } finally {
      setIsLoadingRouter(false);
      setIsLoadingHistory(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Handlers ────────────────────────────────────────────────
  const handleForward = (router_id: number) => {
    console.log('Reenviar:', router_id);
  };

  const handleBackup = (router_id: number) => {
    console.log('Respaldo:', router_id);
  };

  const handleViewRoutes = (router: Router) => {
    console.log('Ver rutas:', router);
  };

  return (
    <>
      <PageMeta
        title={`Tramite (Derivación) #${router?.id} | ${APP_NAME}`}
        description="Información detallada del trámite"
      />

      <PageBreadCrumb
        pageTitle={`Tramite (Derivación) #${router?.id}`}
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
              onClick={() => handleViewRoutes(router)}
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
              onClick={() => handleBackup(router.id)}
            >
              Respaldo
            </Button>
          </Tooltip>
          <Tooltip content="Reenviar">
            <Button
              variant="info"
              size="sm"
              startIcon={<ForwardIcon className="size-3.5" />}
              onClick={() => handleForward(router.id)}
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
          <RouterRoutes document={document} isLoading={isLoadingHistory} />
        </div>
      </div>
    </>
  );
}
