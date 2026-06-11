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
import { InboxIcon, RouteIcon, TrashBinIcon } from '../../../../icons';
import PendingInfo from '../../components/correspondence/pending/PendingInfo.tsx';
import { RouterRoutes } from '../../components/shared/RouterRoutes.tsx';

export default function PendingShowPage() {
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
  const handleViewRoutes = (router: Router) => {
    console.log('Rutas:', router);
  };

  const handleReceive = (router_id: number) => {
    console.log('Recibir:', router_id);
  };

  const handleDelete = (router_id: number) => {
    console.log('Eliminar:', router_id);
  };

  return (
    <>
      <PageMeta
        title={`Tramite (Derivación) #${router?.id} | ${APP_NAME}`}
        description="Información detallada del tramite sin acción"
      />
      <PageBreadCrumb
        pageTitle={`Tramite (Derivación) #${router?.id}`}
        items={[
          {
            label: 'Sin acción',
            path: ROUTES.CORRESPONDENCE.PENDING.ALL,
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
          <Tooltip content="Recibir">
            <Button
              className="mr-3"
              variant="info"
              size="sm"
              startIcon={<InboxIcon className="size-3.5" />}
              onClick={() => handleReceive(router.id)}
            >
              Recibir
            </Button>
          </Tooltip>
          <Tooltip content="Eliminar">
            <Button
              variant="danger"
              size="sm"
              startIcon={<TrashBinIcon className="size-3.5" />}
              onClick={() => handleDelete(router.id)}
            >
              Eliminar
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <PendingInfo router={router} isLoading={isLoadingRouter} />
        </div>

        <div className="xl:col-span-2">
          <RouterRoutes document={document} isLoading={isLoadingHistory} />
        </div>
      </div>
    </>
  );
}
