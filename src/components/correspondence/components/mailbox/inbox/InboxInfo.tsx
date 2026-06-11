import { formatDateBo, getYear } from '../../../../../utils/format.utils.ts';
import { useTypeDocument } from '../../../hooks/catalog/useTypeDocument.ts';
import { useOrigin } from '../../../hooks/catalog/useOrigin.ts';
import { useProcedure } from '../../../hooks/catalog/useProcedure.ts';
import { StateDocumentBadge } from '../../shared/StateDocumentBadge.tsx';
import { PriorityBadge } from '../../shared/PriorityBadge.tsx';
import { Router } from '../../../types/routers/router.type.ts';
import { useDepartment } from '../../../hooks/catalog/useDepartment.ts';

interface Props {
  router?: Router | null;
  isLoading?: boolean;
}

const SkeletonLine = ({ width }: { width: string }) => (
  <div className={`h-5 animate-pulse rounded bg-gray-200 dark:bg-white/[0.08] ${width}`} />
);

export default function InboxInfo({ router, isLoading }: Props) {
  const { getNameById: getNameByIdTypeDocument } = useTypeDocument();
  const { getNameByValue } = useOrigin();
  const { getNameById: getNameByIdProcedure } = useProcedure();
  const { getNameById: getNameByIdDeparment } = useDepartment();

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

  if (!router) return null;

  const items = [
    ['Nro. de tramite antiguo', router?.document_id],
    ['Tipo de trámite', getNameByIdProcedure(router.procedure_id)],
    ['Para', getNameByIdDeparment(router.department_id_destino)],
    ['De', getNameByIdDeparment(router.department_id_origen)],
    ['Fecha origen doc.', formatDateBo(router.document?.doc_fecha_origen)],
    ['Remite', router.rout_remite_document],
    ['Procedencia', getNameByValue(router.document?.doc_procedencia)],
    ['Tipo de documento', getNameByIdTypeDocument(router.type_document_id)],
    ['Cite', router.rout_cite_document],
    ['Nro. cite', router.rout_numero_cite],
    ['Referencia', router.rout_referencia_document],
    ['Aclaración proveido', router.rout_aclaracion_proveido],
    ['Anexos', router.rout_anexos_document],
    ['Fojas', router.rout_fojas_document],
    ['Recibido por', ''],
    ['Archivo', ''],
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header: contador + botón copiar */}
      <div className="mb-5 flex items-start justify-between border-b border-gray-100 pb-5 dark:border-white/[0.05]">
        <div className="flex items-center gap-2">
          <span className="border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:text-brand-400 dark:bg-brand-500/10 text-md rounded-full border px-3.5 py-1.5 font-medium">
            {router.document?.doc_contador ?? ''}/{getYear(router.document?.created_at) ?? ''}
          </span>
          <PriorityBadge priorityId={router.priority_id} />
        </div>
        <span className="text-sm text-gray-400 dark:text-gray-500">
          {formatDateBo(router.document?.doc_fecha_origen)}
        </span>
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
        <StateDocumentBadge stateDocumentId={router.state_document_id} />
      </div>
    </div>
  );
}
