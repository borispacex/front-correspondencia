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
import { PencilIcon, PrinterIcon, SendHorizontalIcon, TrashBinIcon } from '../../../../icons';
import MyDocumentInfo from '../../components/documents/my-documents/MyDocumentInfo.tsx';
import { RouterRoutes } from '../../components/shared/RouterRoutes.tsx';

export default function MyDocumentShowPage() {
  const { id } = useParams();

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
  const handleDerive = (document: Document) => {
    console.log('Derivar', document);
  };
  const handleEdit = (document: Document) => {
    console.log('Editar', document);
  };
  const handleViewSheet = (document: Document) => {
    console.log('Hoja de ruta', document);
  };
  const handleDelete = (document_id: number) => {
    console.log('Eliminar', document_id);
  };

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
              onClick={() => handleViewSheet(document)}
            >
              Hoja de ruta
            </Button>
          </Tooltip>
          <Tooltip content="Editar">
            <Button
              className="mr-3"
              variant="action"
              size="sm"
              onClick={() => handleEdit(document)}
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
              onClick={() => handleDerive(document)}
            >
              Derivar
            </Button>
          </Tooltip>
          <Tooltip content="Eliminar">
            <Button
              variant="danger"
              size="sm"
              startIcon={<TrashBinIcon className="size-3.5" />}
              onClick={() => handleDelete(document.id)}
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
          <RouterRoutes document={document} isLoading={isLoadingHistory} />
        </div>
      </div>
    </>
  );
}
