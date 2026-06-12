import { FileInputIcon, RouteIcon } from '../../../../icons';
import { Router } from '../../types/routers/router.type.ts';
import { Document } from '../../types/documents/document.type.ts';

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

function formatDateTime(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return (
    d.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' +
    d.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })
  );
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function stripHtml(value?: string): string {
  if (!value) return '';
  return value.replace(/<[^>]+>/g, '').trim();
}

const PENDING_STATE_IDS = [1, 2];
const ATTENDED_STATE_IDS = [3, 4, 5];

function getStateCls(stateId: number): string {
  if (PENDING_STATE_IDS.includes(stateId))
    return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-300 dark:border-yellow-500/20';
  if (ATTENDED_STATE_IDS.includes(stateId))
    return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/20';
  return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-white/[0.05] dark:text-gray-400 dark:border-white/[0.08]';
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
  const isUrgent = doc.priority_id === 1 || stripHtml(doc.pri_name).toUpperCase().includes('URGENTE');

  return (
    <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-white/[0.05] dark:bg-white/[0.02]">
      {/* Cites + estado */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Cite principal */}
          <span className="border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
            {doc.doc_numero_cite ?? doc.doc_cite ?? `DOC-${doc.id}`}
          </span>
          {/* Hoja de ruta */}
          {doc.doc_contador && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-gray-300">
              <RouteIcon className="h-3 w-3" />
              {doc.doc_contador}
            </span>
          )}
        </div>

        {/* Prioridad + estado */}
        <div className="flex items-center gap-2">
          {isUrgent && (
            <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-red-700 uppercase dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              Urgente
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getStateCls(doc.state_document_id)}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {doc.sdoc_name ?? 'Sin estado'}
          </span>
        </div>
      </div>

      {/* Referencia / asunto */}
      {doc.doc_referencia && (
        <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{doc.doc_referencia}</p>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {doc.doc_remite && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-300">{doc.doc_remite}</span>
          </span>
        )}
        {doc.doc_dep_name && <span className="text-xs text-gray-500 dark:text-gray-400">{doc.doc_dep_name}</span>}
        {doc.typ_name && <span className="text-xs text-gray-500 dark:text-gray-400">{doc.typ_name}</span>}
        {(doc.doc_fecha_origen ?? doc.created_at) && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(doc.doc_fecha_origen ?? doc.created_at)}
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
            <span className="text-[11px] text-gray-400 dark:text-gray-500">{formatDateTime(router.created_at)}</span>
            {router.rout_numero_cite && (
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                {router.rout_numero_cite}
              </span>
            )}
          </div>
        </div>

        {/* Destinatario */}
        {router.rout_recibe && (
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="text-[11px] text-gray-500 dark:text-gray-400">Para:</span>
            <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{router.rout_recibe}</span>
          </div>
        )}

        {/* Referencia */}
        {router.rout_referencia_document && (
          <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            {router.rout_referencia_document}
          </p>
        )}

        {/* Observación */}
        {router.rout_observacion && (
          <div className="mt-2.5 flex items-start gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-2 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <span className="mt-px text-[10px] font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
              Obs.
            </span>
            <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">{router.rout_observacion}</p>
          </div>
        )}

        {/* Estado de la derivación */}
        {router.stateDocument?.sdoc_name && (
          <div className="mt-2.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStateCls(router.state_document_id)}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {router.stateDocument.sdoc_name}
            </span>
          </div>
        )}
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
