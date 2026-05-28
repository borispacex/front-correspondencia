import {useCallback, useEffect, useMemo, useState} from "react";

import PageMeta from "../../common/PageMeta.tsx";
import PageBreadCrumb from "../../common/PageBreadCrumb.tsx";

import Button from "../../ui/button/Button.tsx";

import { PlusIcon } from "../../../icons";

import { usePermissions } from "../../../hooks/usePermissions.ts";
import { useNotifications } from "../../../hooks/useNotification.tsx";

import {
    CreateDocumentRequest,
    Document,
    DocumentFilters,
    SortConfig, UpdateDocumentRequest,
} from "../types/documents/document.type.ts";

import DocumentTable from "../components/documents/DocumentTable.tsx";
import { DocumentShow } from "../components/documents/DocumentShow.tsx";
import { DocumentFilter } from "../components/documents/DocumentFilter.tsx";
import ModalDelete from "../../modal/ModalDelete.tsx";
import {Modal} from "../../ui/modal";
import DocumentForm from "../components/documents/DocumentForm.tsx";
import {getDocuments} from "../services/document.service.ts";

export const DocumentPage = () => {

    const { can } = usePermissions();
    const { addNotification } = useNotifications();


    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selected, setSelected] = useState<Document | null>(null);
    const [confirmId, setConfirmId] = useState<number | null>(null);

    const handleToggleActive = (
        item: Document,
        active: boolean
    ) => {

        setDocuments((prev) =>
            prev.map((doc) =>
                doc.id === item.id
                    ? {
                        ...doc,
                        deleted_at: active
                            ? null
                            : new Date().toISOString(),
                    }
                    : doc
            )
        );
    };

    const handleDerive = (document: Document) => {
        console.log("Derivar:", document);
    };

    const handleViewHeader = (document: Document) => {
        console.log("Cabecera:", document);
    };

    const handleViewSheet = (document: Document) => {
        console.log("Hoja:", document);
    };

    const handleViewRoutes = (document: Document) => {
        console.log("Rutas:", document);
    };

    const handleView = (document: Document) => {
        setSelected(document);
    };

    const [filters, setFilters] = useState<DocumentFilters>({
        nro: "",
        old: "",
        origin: "",
        subject: "",
        priority: "",
    });

    const [sort, setSort] = useState<SortConfig>({
        field: "id",
        dir: "desc",
    });

    // ─────────────────────────────────────────────────────────────
    // Filtered data
    // ─────────────────────────────────────────────────────────────

    const filteredDocuments = useMemo(() => {

        const filtered = documents.filter((document) => {

            const nroMatch =
                !filters.nro ||
                String(document.doc_contador ?? "")
                    .toLowerCase()
                    .includes(filters.nro.toLowerCase());

            const oldMatch =
                !filters.old ||
                String(document.doc_cite ?? "")
                    .toLowerCase()
                    .includes(filters.old.toLowerCase());

            const originMatch =
                !filters.origin ||
                String(document.doc_dep_name ?? "")
                    .toLowerCase()
                    .includes(filters.origin.toLowerCase());

            const subjectMatch =
                !filters.subject ||
                String(document.doc_referencia ?? "")
                    .toLowerCase()
                    .includes(filters.subject.toLowerCase());

            const priorityMatch =
                !filters.priority ||
                String(document.pri_name ?? "")
                    .toLowerCase()
                    .includes(filters.priority.toLowerCase());

            return (
                nroMatch &&
                oldMatch &&
                originMatch &&
                subjectMatch &&
                priorityMatch
            );
        });

        return [...filtered].sort((a, b) => {

            const aVal = String(
                a[sort.field as keyof Document] ?? ""
            );

            const bVal = String(
                b[sort.field as keyof Document] ?? ""
            );

            const cmp = aVal.localeCompare(
                bVal,
                undefined,
                {
                    numeric: true,
                    sensitivity: "base",
                }
            );

            return sort.dir === "asc"
                ? cmp
                : -cmp;
        });

    }, [documents, filters, sort]);

    function handleCreate() {
        setSelected(null);
        setIsModalOpen(true);
    }

    function handleEdit(document: Document) {
        setSelected(document);
        setIsModalOpen(true);
    }

    function handleDelete(id: number) {
        setConfirmId(id);
    }

    async function handleConfirmDelete() {
        if (confirmId === null) return;

        try {
            // await deleteDocument(confirmId);

            addNotification({
                type: "success",
                title: "Documento eliminado",
                message: "El documento fue eliminado correctamente.",
            });

            setConfirmId(null);
            fetchDocuments();
        } catch (err: any) {
            addNotification({
                type: "error",
                title: "Error",
                message:
                    err?.response?.data?.message ??
                    "Error al eliminar el documento",
            });
        }
    }

    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getDocuments();
            setDocuments(data);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    async function handleSubmit(data: CreateDocumentRequest | UpdateDocumentRequest) {
        try {
            if (selected) {
                // await updateDocument(selected.id, data as UpdateDocumentRequest);

                addNotification({
                    type: "info",
                    title: "Documento actualizado",
                    message: `El documento "${data.doc_numero_cite}" fue actualizado correctamente.`,
                });
            } else {
                // await createDocument(data as CreateDocumentRequest);

                addNotification({
                    type: "success",
                    title: "Documento creado",
                    message: `El documento "${data.doc_numero_cite}" fue creado correctamente.`,
                });
            }

            setIsModalOpen(false);
            fetchDocuments();
        } catch (err: any) {
            addNotification({
                type: "error",
                title: "Error",
                message:
                    err?.response?.data?.message ??
                    "Error al guardar el usuario",
            });
        }
    }

    return (
        <>
            <PageMeta
                title="Documentos"
                description="Gestión de documentos del sistema"
            />

            <PageBreadCrumb pageTitle="Documentos" />

            <div className="space-y-5">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">

                    <DocumentFilter
                        filters={filters}
                        sort={sort}
                        onFiltersChange={setFilters}
                        onSortChange={setSort}
                    />

                    {can("documents.create") && (
                        <Button
                            size="sm"
                            onClick={handleCreate}
                            startIcon={
                                <PlusIcon className="size-4 text-white" />
                            }
                        >
                            Nuevo Documento
                        </Button>
                    )}

                </div>
                {/* Content */}
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[70%_30%]">
                    <DocumentTable
                        documents={filteredDocuments}
                        isLoading={isLoading}
                        selectedDocumentId={selected?.id}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleActive={handleToggleActive}
                        onDerive={handleDerive}
                        onViewHeader={handleViewHeader}
                        onViewSheet={handleViewSheet}
                        onViewRoutes={handleViewRoutes}
                        onView={handleView}
                    />
                    <DocumentShow document={selected} />
                </div>

            </div>

            <Modal
                isOpen={isModalOpen}
                size="lg"
                onClose={() => setIsModalOpen(false)}
                className="w-full max-w-6xl p-6 sm:p-8"
            >
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                    {selected ? "Editar Documento" : "Nuevo Documento"}
                </h3>
                <p className="mb-5 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                    Los campos marcados con <span className="text-error-500"> * </span> son obligatorios
                </p>

                <DocumentForm
                    document={selected}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            <ModalDelete isOpen={confirmId !== null}
                         onClose={() => setConfirmId(null)}
                         onConfirm={handleConfirmDelete}
                         title="¿Eliminar este Documento?"
                         message="Esta acción no se puede deshacer."
            />

        </>
    );
};