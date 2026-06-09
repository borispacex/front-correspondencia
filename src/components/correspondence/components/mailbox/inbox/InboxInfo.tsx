import { Document } from '../../../types/documents/document.type.ts';
import { formatDateBo } from '../../../../../utils/format.utils.ts';

interface Props {
  document?: Document | null;
  isLoading?: boolean;
}

const SkeletonLine = ({ width }: { width: string }) => (
  <div className={`h-4 animate-pulse rounded bg-gray-200 dark:bg-white/[0.08] ${width}`} />
);

export default function InboxInfo({ document, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <SkeletonLine width="w-40" />

        <div className="mt-6 space-y-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonLine key={i} width="w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  const items = [
    ['Trámite', document.doc_contador],
    ['Procedencia', document.doc_dep_name],
    ['Tipo', document.typ_name],
    ['Cite', document.doc_numero_cite],
    ['Fecha Origen', formatDateBo(document.doc_fecha_origen)],
    ['Remitente', document.doc_remite],
    ['Prioridad', document.pri_name],
    ['Referencia', document.doc_referencia],
    ['Anexos', document.doc_anexos],
    ['Fojas', document.doc_fojas],
    ['Fecha Registro', formatDateBo(document.created_at)],
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white">Información del Documento</h2>

      <div className="space-y-4">
        {items.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1 border-b border-gray-100 pb-3 dark:border-white/[0.05]">
            <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>

            <span className="text-sm text-gray-800 dark:text-gray-200">{value || '-'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
