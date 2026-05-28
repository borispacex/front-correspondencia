import { Document } from "../../types/documents/document.type.ts";
import {FileIcon, } from "../../../../icons";

interface DocumentDashboardProps {
    documents: Document[];
    isLoading?: boolean;
}

const SkeletonLine = ({width}: { width: string; }) => (
    <div
        className={`h-4 animate-pulse rounded bg-gray-200 dark:bg-white/[0.08] ${width}`}
    />
);

const DocumentInfoSkeleton = () => {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">

            <div className="mb-6">
                <SkeletonLine width="w-28" />
            </div>

            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
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
                    No existe documentos
                </h3>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Actualiza documentos, por favor.
                </p>
            </div>
        </div>
    );
};

const DocumentDashboardCard = ({documents,}: { documents: Document[]; }) => {

    const total = documents.length;
    const urgentes = documents.filter(d => d.pri_name === "URGENTE").length;
    const eliminados = documents.filter(d => d.deleted_at).length;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <h2 className="mb-5 text-base font-semibold text-gray-800 dark:text-white/90">
                Panel documentos
            </h2>

            <div className="space-y-3">
                {[
                    {
                        label: "TOTAL",
                        value: total ?? "-",
                    },
                    {
                        label: "URGENTES",
                        value: urgentes ?? "-",
                    },
                    {
                        label: "ELIMINADOS",
                        value: eliminados ?? "-",
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

export const DocumentDashboard = ({documents, isLoading = false,}: DocumentDashboardProps) => {
    return (
        <div className="flex flex-col gap-5">
            {isLoading ? (
                <DocumentInfoSkeleton />
            ) : !documents ? (
                <EmptyDocumentState />
            ) : (
                <DocumentDashboardCard documents={documents} />
            )}
        </div>
    );
};