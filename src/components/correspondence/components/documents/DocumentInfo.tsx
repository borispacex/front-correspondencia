import {Document} from "../../types/documents/document.type.ts";
import {FileIcon} from "../../../../icons";
import {formatDateBo} from "../../../../utils/format.utils.ts";

interface DocumentInfoProps {
    document?: Document | null;
    isLoading?: boolean;
    isSelected?: boolean;
}

const SkeletonLine = ({width }: { width: string; }) => (
    <div
        className={`h-4 animate-pulse rounded bg-gray-200 dark:bg-white/[0.08] ${width}`}
    />
);

const DocumentInfoSkeleton = () => {
    return (
        <div className={`rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]`}>

            <div className="mb-6">
                <SkeletonLine width="w-28" />
            </div>

            <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex justify-between gap-4"
                    >
                        <SkeletonLine width="w-24" />
                        <SkeletonLine width="w-40" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const EmptyDocumentState = () => {
    return (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 dark:border-white/[0.08] dark:bg-white/[0.03]">

            <div className="flex flex-col items-center justify-center text-center">

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <FileIcon className="h-7 w-7 text-gray-400"/>
                </div>

                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Ningún documento seleccionado
                </h3>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Selecciona un documento de la tabla para visualizar sus
                    detalles.
                </p>
            </div>
        </div>
    );
};

const DocumentInfoCard = ({document, isSelected}: { document: Document; isSelected: boolean }) => {
    return (
        <div className={`rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]
            ${isSelected
                ? `border-brand-300 ring-1 ring-brand-500/20 shadow-sm dark:border-brand-500/40 dark:ring-brand-500/30`
                : `border-gray-100 hover:border-gray-200 dark:border-white/[0.05] dark:hover:border-white/[0.08]`
            }
        `}>
            <h2 className="mb-5 text-base font-semibold text-gray-800 dark:text-white/90">
                # <span className="text-medium">{document.id}</span>
            </h2>

            <div className="space-y-3">
                {[
                    {
                        label: "PROCEDENCIA",
                        value: document.doc_procedencia ?? "-",
                    },
                    {
                        label: "TIPO",
                        value: document.type_document_id ?? "-",
                    },
                    {
                        label: "CITE",
                        value: document.doc_cite ?? "-",
                    },
                    {
                        label: "NRO. CITE",
                        value: document.doc_numero_cite ?? "-",
                    },
                    {
                        label: "FECHA ORIGEN DOC.",
                        value: formatDateBo(document.doc_fecha_origen) ?? "-",
                    },
                    {
                        label: "REMITE",
                        value: document.doc_remite ?? "-",
                    },
                    {
                        label: "PRIORIDAD",
                        value: document.priority_id ?? "-",
                    },
                    {
                        label: "REF.",
                        value: document.doc_referencia ?? "-",
                    },
                    {
                        label: "ANEXOS",
                        value: document.doc_anexos ?? "-",
                    },
                    {
                        label: "FOJAS",
                        value: document.doc_fojas ?? "-",
                    },
                    {
                        label: "FECHA CREACION",
                        value: formatDateBo(document.created_at) ?? "-",
                    },
                ].map(({ label, value }, i) => (
                    <div
                        key={i}
                        className="flex items-start justify-between gap-4"
                    >
                        <span className="w-24 shrink-0 text-xs text-gray-400 dark:text-gray-500">
                            {label}
                        </span>

                        <span className="text-right text-sm text-gray-700 dark:text-gray-200">
                            {value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DocumentInfo = ({document, isLoading, isSelected=false}: DocumentInfoProps) => {
    return (
        <>
            {isLoading ? (
                <DocumentInfoSkeleton />
            ) : !document ? (
                <EmptyDocumentState />
            ) : (
                <DocumentInfoCard document={document} isSelected={isSelected} />
            )}
        </>
    )
}