import { useEffect, useState } from 'react';
import { Document } from '../../types/documents/document.type.ts';
import PageMeta from '../../../common/PageMeta.tsx';
import PageBreadCrumb from '../../../common/PageBreadCrumb.tsx';

import { APP_NAME } from '../../constants/correspondence.constants.ts';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../../../constants/routes.constants.ts';
import { AllDocumentFilter } from '../../components/documents/all-documents/AllDocumentFilter.tsx';

import AllDocumentTable from '../../components/documents/all-documents/AllDocumentTable.tsx';
import { useDocument } from '../../hooks/useDocument.ts';
import { useAllDocumentFilters } from '../../hooks/filters/useAllDocumentFilters.ts';
import RouterRoutesModal from '../../components/shared/RouterRoutesModal.tsx';

export default function AllDocumentPage() {
  const navigate = useNavigate();
  const { documents, isLoading, getAll } = useDocument();

  const [openRoutesModal, setOpenRoutesModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // ──────────────────────────── filters ─────────────────────────────────
  const { filters, setFilters, sort, setSort, resetFilters, filteredDocuments } = useAllDocumentFilters(documents);
  // ──────────────────────────── Load data ─────────────────────────────────
  useEffect(() => {
    getAll({ included: ['routers'] });
  }, [getAll]);

  // ─────────────────────────── Handlers ──────────────────────────────────
  const handleViewRoutes = (document: Document) => {
    setSelectedDocument(document);
    setOpenRoutesModal(true);
  };
  const handleView = (document: Document) => {
    navigate(`${ROUTES.DOCUMENTS.ALL_DOCUMENTS.ALL}/${document.id}`);
  };
  // ─────────────────────────── Render ──────────────────────────────────
  return (
    <>
      <PageMeta title={`Buscar trámite | ${APP_NAME}`} description="Buscador de tramites" />
      <PageBreadCrumb pageTitle="Buscar trámite" />

      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <AllDocumentFilter
            filters={filters}
            sort={sort}
            onFiltersChange={setFilters}
            onSortChange={setSort}
            onReset={resetFilters}
          />
        </div>

        <AllDocumentTable
          documents={filteredDocuments}
          isLoading={isLoading}
          onViewRoutes={handleViewRoutes}
          onView={handleView}
        />
      </div>

      {/********************************** MODALES ***********************************/}
      <RouterRoutesModal
        isOpen={openRoutesModal}
        onClose={() => setOpenRoutesModal(false)}
        document={selectedDocument}
      />
    </>
  );
}
