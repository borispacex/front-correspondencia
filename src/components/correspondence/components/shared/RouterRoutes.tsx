import { ArrowRightIcon, FileInputIcon, RouteIcon } from '../../../../icons';
import { Router } from '../../types/routers/router.type.ts';
import { Document } from '../../types/documents/document.type.ts';
import { StateDocumentBadge } from './StateDocumentBadge.tsx';
import { PriorityBadge } from './PriorityBadge.tsx';
import { formatDateBo, getYear } from '../../../../utils/format.utils.ts';
import { useDepartment } from '../../hooks/catalog/useDepartment.ts';
import { useProcedure } from '../../hooks/catalog/useProcedure.ts';
import { useOrigin } from '../../hooks/catalog/useOrigin.ts';
import { useTypeDocument } from '../../hooks/catalog/useTypeDocument.ts';
import Badge from '../../../ui/badge/Badge.tsx';
import { useUnit } from '../../hooks/catalog/useUnit.ts';
import { ProvidedBadge } from './ProvidedBadge.tsx';

interface Props {
  document?: Document | null;
  isLoading?: boolean;
  isSelected?: boolean;
}

function getInitials(name?: string): string {
  if (!name) return '?';
  const clean = name.replace(/^(CRNL\.|ING\.|DAEN\.|CNL\.|DR\.|LIC\.)\s*/gi, '').trim();
  const parts = clean.split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

function stripHtml(value?: string): string {
  if (!value) return '';
  return value.replace(/<[^>]+>/g, '').trim();
}

function SkeletonLine({ className }: { className?: string }) {
  return <div className={`h-4 animate-pulse rounded bg-gray-200 dark:bg-white/[0.08] ${className ?? ''}`} />;
}

function DocumentHistorySkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="mb-5 space-y-2">
        <SkeletonLine className="w-40" />
        <SkeletonLine className="w-64" />
        <SkeletonLine className="w-32" />
      </div>
      <SkeletonLine className="mb-4 w-24" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-white/[0.08]" />
            <div className="flex-1 space-y-2">
              <SkeletonLine className="w-48" />
              <SkeletonLine className="w-36" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyHistoryState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 dark:border-white/[0.08] dark:bg-white/[0.03]">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <FileInputIcon className="h-7 w-7 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Ningún documento seleccionado</h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Selecciona un documento de la tabla para visualizar su recorrido.
        </p>
      </div>
    </div>
  );
}

function EmptyRoutersState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-8 text-center dark:border-white/[0.08]">
      <RouteIcon className="mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" />
      <p className="text-xs text-gray-500 dark:text-gray-400">Este tramite aún no tiene derivaciones registradas.</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DocumentHeader
// ─────────────────────────────────────────────────────────────
function DocumentHeader({ document: doc }: { document: Document }) {
  const { getNameByValue } = useOrigin();
  const { getNameById: getNameByIdProcedure } = useProcedure();
  const { getNameById: getNameByIdTypeDocument } = useTypeDocument();

  return (
    <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-white/[0.05] dark:bg-white/[0.02]">
      {/* Cites + estado */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {/* Cite principal */}
          <span className="border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300 text-md inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium">
            {doc.doc_contador ?? ''}/{getYear(doc.created_at) ?? ''}
          </span>
          <div>
            {/* Hoja de ruta */}
            {doc.id && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-gray-300">
                <RouteIcon className="h-3 w-3" />
                {doc.id}
              </span>
            )}
            {doc.doc_cite && <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">{doc.doc_cite}</p>}
          </div>
        </div>

        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-2">
            {doc.priority_id && <PriorityBadge priorityId={doc.priority_id} />}
            <StateDocumentBadge stateDocumentId={doc.state_document_id} />
          </div>
          {doc.doc_numero_cite && (
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{doc.doc_numero_cite}</span>
          )}
        </div>
      </div>

      {/* Procedencia */}
      {doc.doc_procedencia && (
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Procedencia:</span>
          <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
            {getNameByValue(doc.doc_procedencia)}
          </span>
        </div>
      )}
      {/* Tipo tramite */}
      {doc.doc_procedencia && (
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Tipo de trámite:</span>
          <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
            {getNameByIdProcedure(doc.procedure_id)}
          </span>
        </div>
      )}
      {/* Tipo de documento */}
      {doc.doc_procedencia && (
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Tipo de documento:</span>
          <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
            {getNameByIdTypeDocument(doc.type_document_id)}
          </span>
        </div>
      )}
      {/* Referencia / asunto */}
      {doc.doc_remite && (
        <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span className="text-[12px] text-gray-500 dark:text-gray-400">Remite:</span>
          <span className="text-[12px] font-medium text-gray-700 dark:text-gray-300">{doc.doc_remite}</span>
        </span>
      )}
      {/* Meta */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {doc.doc_referencia && (
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-gray-500 dark:text-gray-400">Referencia:</span>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{doc.doc_referencia}</p>
          </div>
        )}
        {(doc.doc_fecha_origen ?? doc.created_at) && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDateBo(doc.doc_fecha_origen ?? doc.created_at)}
          </span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RouterStep — un paso en el timeline
// ─────────────────────────────────────────────────────────────
type StepVariant = 'origin' | 'middle' | 'last';

function RouterStep({ router, variant }: { router: Router; variant: StepVariant }) {
  const ini = getInitials(router.rout_remite_document);

  // Colores del avatar y línea según variante
  const avatarCls =
    variant === 'origin'
      ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300'
      : variant === 'last'
        ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
        : 'bg-gray-100 text-gray-600 dark:bg-white/[0.08] dark:text-gray-300';

  const dotRingCls =
    variant === 'origin'
      ? 'border-brand-400 dark:border-brand-500'
      : variant === 'last'
        ? 'border-green-400 dark:border-green-500'
        : 'border-gray-300 dark:border-white/[0.15]';

  const cardBorderCls =
    variant === 'origin'
      ? 'border-brand-200 dark:border-brand-500/30'
      : variant === 'last'
        ? 'border-green-200 dark:border-green-500/30'
        : 'border-gray-100 dark:border-white/[0.05]';

  // Catalog
  const { getNameById: getNameByIdDepartment, getUnitIdById } = useDepartment();
  const { getNameById } = useUnit();

  return (
    <div className="relative flex gap-3">
      {/* Dot + línea vertical */}
      <div className="flex flex-col items-center">
        <div
          className={`z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 bg-white dark:bg-gray-900 ${dotRingCls}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${variant === 'origin' ? 'bg-brand-400' : variant === 'last' ? 'bg-green-400' : 'bg-gray-300 dark:bg-gray-500'}`}
          />
        </div>
        {variant !== 'last' && <div className="mt-1 w-px flex-1 bg-gray-200 dark:bg-white/[0.08]" />}
      </div>

      {/* Card */}
      <div className={`mb-3 flex-1 rounded-xl border bg-white p-3.5 dark:bg-white/[0.02] ${cardBorderCls}`}>
        {/* Remitente + fecha */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${avatarCls}`}
            >
              {ini}
            </div>
            <div>
              <p className="text-xs leading-tight font-semibold text-gray-800 dark:text-white/90">
                {router.rout_remite_document ?? '—'}
              </p>
              {router.rout_cite_document && (
                <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">{router.rout_cite_document}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              <Badge variant="light" size="sm" color={router.rout_recibe ? 'success' : 'warning'}>
                Recibido: {router.rout_recibe ? formatDateBo(router.rout_recibe) : 'Sin fecha'}
              </Badge>
            </span>
            {router.rout_numero_cite && (
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                {router.rout_numero_cite}
              </span>
            )}
          </div>
        </div>
        {/* Referencia */}
        {router.rout_referencia_document && (
          <div className="my-2.5 flex items-center gap-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">Referencia:</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {router.rout_referencia_document}{' '}
            </span>
          </div>
        )}
        {/* Provided */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <span></span>
          <ProvidedBadge size="xs" providedIds={router.provided_id} />
        </div>

        {/* Estado de la derivación */}
        <div className="mt-2.5 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <div>{router.state_document_id && <StateDocumentBadge stateDocumentId={router.state_document_id} />}</div>
          <div className="flex items-center justify-center gap-1 text-center">
            <span className="text-[11px] text-gray-600 dark:text-gray-400">
              {`${getNameById(getUnitIdById(router.department_id_origen))} · ${getNameByIdDepartment(router.department_id_origen)}`}
            </span>
            <ArrowRightIcon className="h-3 w-3 text-gray-400" />
            <span className="text-[11px] text-gray-600 dark:text-gray-400">
              {`${getNameById(getUnitIdById(router.department_id_destino))} · ${getNameByIdDepartment(router.department_id_destino)}`}
            </span>
          </div>
          <div>
            {router.created_at && (
              <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateBo(router.created_at)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RouterTimeline({ routers }: { routers: Router[] }) {
  return (
    <div className="mt-1">
      {/* Label sección */}
      <p className="mb-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
        Recorrido · {routers.length} derivación{routers.length !== 1 ? 'es' : ''}
      </p>

      <div>
        {routers.map((r, i) => {
          const variant: StepVariant = i === 0 ? 'origin' : i === routers.length - 1 ? 'last' : 'middle';
          return <RouterStep key={r.id} router={r} variant={variant} />;
        })}
      </div>
    </div>
  );
}

export const RouterRoutes = ({ document, isLoading, isSelected = false }: Props) => {
  if (isLoading) return <DocumentHistorySkeleton />;
  if (!document) return <EmptyHistoryState />;

  const routers = document.routers ?? [];

  return (
    <div
      className={`rounded-2xl border bg-white p-5 dark:bg-white/[0.03] ${
        isSelected
          ? 'border-brand-300 ring-brand-500/20 dark:border-brand-500/40 dark:ring-brand-500/30 shadow-sm ring-1'
          : 'border-gray-200 dark:border-white/[0.05]'
      }`}
    >
      {/* Cabecera del documento */}
      <DocumentHeader document={document} />

      {/* Timeline o empty */}
      {routers.length === 0 ? <EmptyRoutersState /> : <RouterTimeline routers={routers} />}
    </div>
  );
};
