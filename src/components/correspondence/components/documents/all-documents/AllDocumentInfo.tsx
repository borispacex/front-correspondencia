import { Document } from '../../../types/documents/document.type.ts';
import { formatDateBo, getYear } from '../../../../../utils/format.utils.ts';
import { useTypeDocument } from '../../../hooks/catalog/useTypeDocument.ts';
import { useOrigin } from '../../../hooks/catalog/useOrigin.ts';
import { useProcedure } from '../../../hooks/catalog/useProcedure.ts';
import { StateDocumentBadge } from '../../shared/StateDocumentBadge.tsx';
import { PriorityBadge } from '../../shared/PriorityBadge.tsx';

interface Props {
  document?: Document | null;
  isLoading?: boolean;
}

const SkeletonLine = ({ width }: { width: string }) => (
  <div className={`h-5 animate-pulse rounded bg-gray-200 dark:bg-white/[0.08] ${width}`} />
);

export default function AllDocumentInfo({ document, isLoading }: Props) {
  const { getNameById: getNameByIdTypeDocument } = useTypeDocument();
  const { getNameByValue } = useOrigin();
  const { getNameById: getNameByIdProcedure } = useProcedure();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <SkeletonLine width="w-40" />
        <div className="mt-6 space-y-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonLine key={i} width="w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!document) return null;

  const items = [
    ['Procedencia', getNameByValue(document.doc_procedencia)],
    ['Tipo de trámite', getNameByIdProcedure(document.procedure_id)],
    ['Tipo de documento', getNameByIdTypeDocument(document.type_document_id)],
    ['Cite', document.doc_cite],
    ['Nro. cite', document.doc_numero_cite],
    ['Fecha origen doc.', formatDateBo(document.doc_fecha_origen)],
    ['Remite', document.doc_remite],
    ['Referencia', document.doc_referencia],
    ['Anexos', document.doc_anexos],
    ['Fojas', document.doc_fojas],
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header: contador + botón copiar */}
      <div className="mb-5 flex items-start justify-between border-b border-gray-100 pb-5 dark:border-white/[0.05]">
        <div className="flex items-center gap-3">
          <span className="border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:text-brand-400 dark:bg-brand-500/10 text-md rounded-full border px-3.5 py-1.5 font-medium">
            {document.doc_contador ?? ''}/{getYear(document.created_at) ?? ''}
          </span>
          <PriorityBadge priorityId={document.priority_id} />
        </div>
        <span className="text-sm text-gray-400 dark:text-gray-500">{formatDateBo(document.doc_fecha_origen)}</span>
      </div>

      {/* Campos */}
      <div>
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-4 border-b border-gray-100 py-3 last:border-none dark:border-white/[0.05]"
          >
            <span className="shrink-0 text-sm text-gray-400">{label}</span>
            <span className="text-right text-sm font-medium text-gray-800 dark:text-gray-200">
              {value || <span className="font-normal text-gray-300 dark:text-gray-600">—</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Estado */}
      <div className="mt-5 border-t border-gray-100 pt-5 dark:border-white/[0.05]">
        <StateDocumentBadge stateDocumentId={document.state_document_id} />
      </div>
    </div>
  );
}
