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
import { ArchiveRestoreIcon, RouteIcon } from '../../../../icons';
import ArchivedInfo from '../../components/correspondence/archived/ArchivedInfo.tsx';
import { RouterRoutes } from '../../components/shared/RouterRoutes.tsx';

export default function ArchivedShowPage() {
  const { id } = useParams();

  const [document, setDocument] = useState<Document | null>(null);

  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchDocument = useCallback(async () => {
    if (!id) return;

    setIsLoadingDocument(true);
    setIsLoadingHistory(true);

    try {
      const response = await getDocumentById(Number(id));

      setDocument(response);

      // TODO:
      // cargar historial/rutas
    } finally {
      setIsLoadingDocument(false);
      setIsLoadingHistory(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  // ── Handlers ────────────────────────────────────────────────
  const handleViewRoutes = (document: Document) => {
    console.log('Rutas:', document);
  };

  const handleUnarchive = (document_id: number) => {
    console.log('Desarchivar:', document_id);
  };

  return (
    <>
      <PageMeta
        title={`Detalle Trámite archivado | ${APP_NAME}`}
        description="Información detallada del tramite archivado"
      />
      <PageBreadCrumb
        pageTitle="Trámite archivado"
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
              onClick={() => handleViewRoutes(document)}
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
              onClick={() => handleUnarchive(document.id)}
            >
              Desarchivar
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <ArchivedInfo document={document} isLoading={isLoadingDocument} />
        </div>

        <div className="xl:col-span-2">
          <RouterRoutes document={document} isLoading={isLoadingHistory} />
        </div>
      </div>
    </>
  );
}
