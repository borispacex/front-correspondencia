import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { Document } from '../../types/documents/document.type.ts';
import { getDocumentById } from '../../services/document.service.ts';
import PageMeta from '../../../common/PageMeta.tsx';
import { APP_NAME } from '../../constants/correspondence.constants.ts';
import PageBreadCrumb from '../../../common/PageBreadCrumb.tsx';
import { ROUTES } from '../../../../constants/routes.constants.ts';
import Tooltip from '../../../form/Tooltip.tsx';
import Button from '../../../ui/button/Button.tsx';
import { RouteIcon } from '../../../../icons';
import AllDocumentInfo from '../../components/documents/all-documents/AllDocumentInfo.tsx';
import { RouterRoutes } from '../../components/shared/RouterRoutes.tsx';

export default function AllDocumentShowPage() {
  const { id } = useParams<{ id: string }>();

  const [document, setDocument] = useState<Document | null>(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchDocument = useCallback(async () => {
    if (!id) return;

    setIsLoadingDocument(true);
    setIsLoadingHistory(true);

    try {
      const response = await getDocumentById(Number(id), { included: ['routers'] });
      setDocument(response);
    } finally {
      setIsLoadingDocument(false);
      setIsLoadingHistory(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  // ── Handlers ────────────────────────────────────────────────
  const handleViewRoutes = (doc: Document) => {
    console.log('Ver rutas', doc);
  };

  // const handleDerive = (doc: Document) => {
  //   console.log('Derivar', doc);
  // };

  return (
    <>
      <PageMeta title={`Tramite #${id} | ${APP_NAME}`} description="Información detallada de los tramites" />

      <PageBreadCrumb
        pageTitle={`Tramite #${id}`}
        items={[{ label: 'Buscar trámite', path: ROUTES.DOCUMENTS.ALL_DOCUMENTS.ALL }, { label: `#${id}` }]}
      />

      {/* ── Barra de acciones ─────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div />
        <div className="flex items-center gap-3">
          <Tooltip content="Ver rutas">
            <Button
              variant="primary"
              size="sm"
              disabled={!document}
              onClick={() => document && handleViewRoutes(document)}
              startIcon={<RouteIcon className="size-3.5" />}
            >
              Ver rutas
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* ── Contenido ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <AllDocumentInfo document={document} isLoading={isLoadingDocument} />
        </div>

        <div className="xl:col-span-2">
          <RouterRoutes document={document} isLoading={isLoadingHistory} />
        </div>
      </div>
    </>
  );
}
