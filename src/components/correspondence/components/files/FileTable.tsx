import { useMemo, useState } from 'react';
import { AngleUpIcon, AngleDownIcon, CopyIcon, EyeIcon, RouteIcon, CalenderIcon } from '../../../../icons';
import TableSkeleton from '../../../animation/TableSkeleton.tsx';
import Tooltip from '../../../form/Tooltip.tsx';
import Button from '../../../ui/button/Button.tsx';
import { Document } from '../../types/documents/document.type.ts';
import { usePermissions } from '../../../../hooks/usePermissions.ts';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from '../../../../icons';

interface Props {
  documents: Document[];
  isLoading?: boolean;
  selectedDocumentId?: number;
  onView?: (document: Document) => void;
  onViewRoutes?: (document: Document) => void;
}

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

// ── Estado badge ───────────────────────────────────────────────────────────────
const STATE_CONFIG: Record<string, { label: string; cls: string }> = {
  Revisado: {
    label: 'Revisado',
    cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  Firmado: {
    label: 'Firmado',
    cls: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  },
  Pendiente: {
    label: 'Pendiente',
    cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  },
};

function StateBadge({ state }: { state?: string }) {
  const key = state ?? 'Pendiente';
  const cfg = STATE_CONFIG[key] ?? STATE_CONFIG['Pendiente'];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.cls}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {cfg.label}
    </span>
  );
}

export default function FileTable({ documents, isLoading, selectedDocumentId, onView, onViewRoutes }: Props) {
  const { can } = usePermissions();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortField, setSortField] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const sorted = useMemo(() => {
    if (!sortField) return documents;
    return [...documents].sort((a, b) => {
      const aVal = String(a[sortField as keyof Document] ?? '');
      const bVal = String(b[sortField as keyof Document] ?? '');
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [documents, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(documents.length / perPage));
  const safePage = Math.min(page, totalPages);
  const total = documents.length;
  const from = total === 0 ? 0 : (safePage - 1) * perPage + 1;
  const to = Math.min(safePage * perPage, total);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage;
    return sorted.slice(start, start + perPage);
  }, [sorted, safePage, perPage]);

  function handlePerPageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPerPage(Number(e.target.value));
    setPage(1);
  }

  function handleSort(field: string) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  }

  function renderSortIcon(field: string) {
    if (sortField !== field) return <AngleDownIcon className="size-3 opacity-30" />;
    return sortDir === 'asc' ? <AngleUpIcon className="size-3" /> : <AngleDownIcon className="size-3" />;
  }

  function renderPageNumbers(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (safePage > 3) pages.push('...');
    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
      pages.push(i);
    }
    if (safePage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  async function handleCopy(document: Document) {
    try {
      await navigator.clipboard.writeText(String(document.doc_contador ?? document.id));
      setCopiedId(document.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch (error) {
      console.error('Error copying', error);
    }
  }

  const btnBase = 'inline-flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition-colors';
  const btnNormal = `${btnBase} border-gray-200 text-gray-500 hover:border-brand-400 hover:text-brand-500 dark:border-gray-700 dark:text-gray-400 disabled:opacity-40`;
  const btnActive = `${btnBase} border-brand-500 bg-brand-500 text-white`;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/[0.05]">
              {/* Documento */}
              <th
                onClick={() => handleSort('doc_numero_cite')}
                className="cursor-pointer px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase select-none hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="flex items-center gap-1">Documento {renderSortIcon('doc_numero_cite')}</span>
              </th>

              {/* Tramite */}
              <th
                onClick={() => handleSort('doc_contador')}
                className="cursor-pointer px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase select-none hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="flex items-center gap-1">Trámite {renderSortIcon('doc_contador')}</span>
              </th>

              {/* Fecha de creación */}
              <th
                onClick={() => handleSort('created_at')}
                className="cursor-pointer px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase select-none hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="flex items-center gap-1">Fecha de creación {renderSortIcon('created_at')}</span>
              </th>

              {/* Creado por */}
              <th className="px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Creado por
              </th>

              {/* Acción realizada */}
              <th className="px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Acción realizada
              </th>

              {/* Estado */}
              <th className="px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Estado
              </th>

              {/* Acciones */}
              <th className="w-28 px-5 py-4 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody
            className={`divide-y divide-gray-100 transition-opacity duration-200 dark:divide-white/[0.05] ${
              isLoading ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            {isLoading && documents.length === 0 ? (
              <TableSkeleton rows={6} cols={7} />
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-14 text-center text-sm text-gray-400">
                  No hay documentos disponibles
                </td>
              </tr>
            ) : (
              paginated.map((document) => (
                <tr
                  key={document.id}
                  className={`transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02] ${
                    selectedDocumentId === document.id ? 'bg-brand-50/40 dark:bg-brand-500/5' : ''
                  }`}
                >
                  {/* ── Documento ─────────────────────────────────────── */}
                  <td className="px-5 py-5 align-top">
                    <div className="space-y-1.5">
                      {/* Badge cite */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 dark:border-teal-500/20 dark:bg-teal-500/10 dark:text-teal-400">
                          {document.doc_numero_cite ?? document.doc_cite ?? `DOC-${document.id}`}
                        </span>
                        <Tooltip content={copiedId === document.id ? 'Copiado' : 'Copiar'}>
                          <button
                            type="button"
                            onClick={() => handleCopy(document)}
                            className={`inline-flex items-center justify-center rounded-md pl-0.5 text-teal-600 transition-colors duration-200 hover:bg-gray-100 hover:text-teal-700 dark:text-teal-400 dark:hover:bg-gray-800 ${
                              copiedId === document.id
                                ? 'bg-brand-100 scale-110 text-teal-600 dark:bg-teal-900/30'
                                : 'scale-100'
                            }`}
                          >
                            <CopyIcon className="size-4" />
                          </button>
                        </Tooltip>
                      </div>

                      {/* Detalles */}
                      <div className="space-y-0.5 text-sm text-gray-700 dark:text-gray-300">
                        {document.doc_referencia && (
                          <p>
                            <span className="font-semibold text-teal-600 dark:text-teal-400">Asunto:</span>{' '}
                            {document.doc_referencia}
                          </p>
                        )}
                        {document.typ_name && (
                          <p>
                            <span className="font-semibold text-teal-600 dark:text-teal-400">Tipo:</span>{' '}
                            {document.typ_name}
                          </p>
                        )}
                        {document.doc_dep_name && (
                          <p>
                            <span className="font-semibold text-teal-600 dark:text-teal-400">Clasificación:</span>{' '}
                            {document.doc_dep_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* ── Tramite ───────────────────────────────────── */}
                  <td className="px-5 py-5 align-top">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-400 rounded-full border px-3 py-1 text-xs font-medium">
                          {document.doc_cite}
                        </span>

                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(document.doc_cite)}
                          className="text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors"
                        >
                          <CopyIcon className="size-4" />
                        </button>
                      </div>
                      {document.doc_referencia && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-brand-600 dark:text-brand-400 font-semibold">Asunto:</span>{' '}
                          {document.doc_referencia}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* ── Fecha de creación ──────────────────────────────── */}
                  <td className="px-5 py-5 align-top">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span>
                        {document.created_at
                          ? new Date(document.created_at).toLocaleDateString('es-BO', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                          : '—'}
                      </span>
                    </div>
                  </td>

                  {/* ── Creado por ─────────────────────────────────────── */}
                  <td className="px-5 py-5 align-top">
                    <div className="flex items-center gap-2.5">
                      {/* Avatar placeholder */}
                      <div className="bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase">
                        {(document.doc_remite ?? 'U').charAt(0)}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800 dark:text-white/90">{document.doc_remite ?? '—'}</p>
                        {document.doc_dep_name && (
                          <p className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                            {document.doc_dep_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* ── Acción realizada ───────────────────────────────── */}
                  <td className="px-5 py-5 align-top">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {/* Puedes mapear doc_state o similar */}
                      {document.id % 3 === 0 ? 'Generé el documento' : 'No participé en el documento'}
                    </span>
                  </td>

                  {/* ── Estado ────────────────────────────────────────── */}
                  <td className="px-5 py-5 align-top">
                    <StateBadge
                      state={
                        document.state_document_id === 4 || document.state_document_id === 5
                          ? 'Firmado'
                          : document.state_document_id === 2 || document.state_document_id === 3
                            ? 'Revisado'
                            : 'Pendiente'
                      }
                    />
                  </td>

                  {/* ── Acciones ──────────────────────────────────────── */}
                  <td className="px-5 py-5 align-top">
                    <div className="flex items-center justify-center gap-2">
                      {can('files.view') && onView && (
                        <Tooltip content="Ver documento">
                          <Button
                            variant="ghost-outline"
                            size="xs"
                            onClick={() => onView(document)}
                            startIcon={<EyeIcon className="size-3.5 fill-blue-500 dark:fill-blue-400" />}
                          />
                        </Tooltip>
                      )}
                      {can('files.routes') && onViewRoutes && (
                        <Tooltip content="Ver rutas">
                          <Button
                            variant="primary-outline"
                            size="xs"
                            onClick={() => onViewRoutes(document)}
                            startIcon={<RouteIcon className="size-3.5" />}
                          />
                        </Tooltip>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Paginación ─────────────────────────────────────────────────────── */}
      {!isLoading && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-3 dark:border-white/[0.05]">
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>Filas por página:</span>
            <select
              value={perPage}
              onChange={handlePerPageChange}
              className="focus:border-brand-400 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              {PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>
              {from}–{to} de {total}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(1)} disabled={safePage === 1} className={btnNormal} title="Primera">
              <ChevronsLeftIcon />
            </button>
            <button
              onClick={() => setPage(safePage - 1)}
              disabled={safePage === 1}
              className={btnNormal}
              title="Anterior"
            >
              <ChevronLeftIcon />
            </button>
            {renderPageNumbers().map((p, i) =>
              p === '...' ? (
                <span key={`e-${i}`} className="inline-flex h-8 w-8 items-center justify-center text-sm text-gray-400">
                  …
                </span>
              ) : (
                <button key={p} onClick={() => setPage(p as number)} className={p === safePage ? btnActive : btnNormal}>
                  {p}
                </button>
              ),
            )}
            <button
              onClick={() => setPage(safePage + 1)}
              disabled={safePage === totalPages}
              className={btnNormal}
              title="Siguiente"
            >
              <ChevronRightIcon />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={safePage === totalPages}
              className={btnNormal}
              title="Última"
            >
              <ChevronsRightIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
