import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import PageMeta from '../../../../common/PageMeta.tsx';
import PageBreadCrumb from '../../../../common/PageBreadCrumb.tsx';

import { Document } from '../../../types/documents/document.type.ts';
import { getDocumentById } from '../../../services/document.service.ts';

import RouterInfo from '../../../components/router/show/RouterInfo.tsx';
import { RouterRoutes } from '../../../components/router/show/RouterRoutes.tsx';
import { ROUTES } from '../../../../../constants/routes.constants.ts';
import { APP_NAME } from '../../../constants/correspondence.constants.ts';

export default function RouterPendingShowPage() {
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

  return (
    <>
      <PageMeta
        title={`Detalle Tramite pendiente | ${APP_NAME}`}
        description="Información detallada del tramite pendiente"
      />

      <PageBreadCrumb
        pageTitle="Tramite pendiente"
        items={[
          {
            label: 'Bandeja de Entrada',
            path: ROUTES.CORRESPONDENCE.ROUTE_SHEET.PENDING,
          },
          {
            label: `#${id}`,
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <RouterInfo document={document} isLoading={isLoadingDocument} />
        </div>

        <div className="xl:col-span-2">
          <RouterRoutes document={document} isLoading={isLoadingHistory} />
        </div>
      </div>
    </>
  );
}
