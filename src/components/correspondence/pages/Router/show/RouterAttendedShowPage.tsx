import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import PageMeta from '../../../../common/PageMeta.tsx';
import PageBreadCrumb from '../../../../common/PageBreadCrumb.tsx';
import { Document } from '../../../types/documents/document.type.ts';
import { getDocumentById } from '../../../services/document.service.ts';
import { RouterRoutes } from '../../../components/router/show/RouterRoutes.tsx';
import { ROUTES } from '../../../../../constants/routes.constants.ts';
import RouterAttendedInfo from '../../../components/router/show/RouterAttendedInfo.tsx';
import { APP_NAME } from '../../../constants/correspondence.constants.ts';
import Tooltip from '../../../../form/Tooltip.tsx';
import Button from '../../../../ui/button/Button.tsx';
import { ArchiveRestoreIcon, FileTextIcon, ForwardIcon, PrinterIcon, RouteIcon } from '../../../../../icons';

export default function RouterAttendedShowPage() {
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
  const handleForward = (document_id: number) => {
    console.log('Reenviar:', document_id);
  };

  const handleBackup = (document_id: number) => {
    console.log('Respaldo:', document_id);
  };

  const handleViewRoutes = (document: Document) => {
    console.log('Ver rutas:', document);
  };

  return (
    <>
      <PageMeta
        title={`Detalle Trámite atendido | ${APP_NAME}`}
        description="Información detallada del trámite atendido"
      />

      <PageBreadCrumb
        pageTitle="Trámite atendido"
        items={[
          {
            label: 'Bandeja de Salida',
            path: ROUTES.CORRESPONDENCE.ROUTE_SHEET.ATTENDED,
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
          <Tooltip content="Respaldo">
            <Button
              className="mr-3"
              variant="secondary"
              size="sm"
              startIcon={<PrinterIcon className="size-3.5" />}
              onClick={() => handleBackup(document.id)}
            >
              Respaldo
            </Button>
          </Tooltip>
          <Tooltip content="Reenviar">
            <Button
              variant="info"
              size="sm"
              startIcon={<ForwardIcon className="size-3.5" />}
              onClick={() => handleForward(document.id)}
            >
              Reenviar
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <RouterAttendedInfo document={document} isLoading={isLoadingDocument} />
        </div>

        <div className="xl:col-span-2">
          <RouterRoutes document={document} isLoading={isLoadingHistory} />
        </div>
      </div>
    </>
  );
}
