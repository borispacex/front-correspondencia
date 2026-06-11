import { useMemo, useState } from 'react';
import { usePermissions } from '../../../../../hooks/usePermissions.ts';
import {
  AngleDownIcon,
  AngleUpIcon,
  ArchiveRestoreIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CopyIcon,
  EyeIcon,
  RouteIcon,
} from '../../../../../icons';
import TableSkeleton from '../../../../animation/TableSkeleton.tsx';
import Tooltip from '../../../../form/Tooltip.tsx';
import Button from '../../../../ui/button/Button.tsx';
import { Router } from '../../../types/routers/router.type.ts';
import { PriorityBadge } from '../../shares/PriorityBadge.tsx';
import { getYear } from '../../../../../utils/format.utils.ts';
import { useTypeDocument } from '../../../hooks/catalog/useTypeDocument.ts';
import { StateDocumentBadge } from '../../shares/StateDocumentBadge.tsx';
import { useOrigin } from '../../../hooks/catalog/useOrigin.ts';
import { useDepartment } from '../../../hooks/catalog/useDepartment.ts';

interface Props {
  routers: Router[];
  isLoading?: boolean;
  onViewRoutes?: (router: Router) => void;
  onView?: (router: Router) => void;
  onUnarchive?: (id: number) => void;
}

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function ArchivedTable({ routers, isLoading, onViewRoutes, onView, onUnarchive }: Props) {
  const { can } = usePermissions();
  const { getNameById } = useTypeDocument();
  const { getNameByValue } = useOrigin();
  const { getNameById: getDeparmentNameById } = useDepartment();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortField, setSortField] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = useMemo(() => {
    if (!sortField) return routers;
    return [...routers].sort((a, b) => {
      const aVal = String(a[sortField as keyof Router] ?? '');
      const bVal = String(b[sortField as keyof Router] ?? '');
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [routers, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(routers.length / perPage));
  const safePage = Math.min(page, totalPages);
  const total = routers.length;
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

  // ── Copy ───────────────────────────────────────────────────────────────────
  const [copiedId, setCopiedId] = useState<number | null>(null);

  async function handleCopy(router: Router) {
    try {
      await navigator.clipboard.writeText(`${router.document?.doc_contador}/${getYear(router.document?.created_at)}`);
      setCopiedId(router.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch (error) {
      console.error('Error copying', error);
    }
  }

  const btnBase = 'inline-flex h-8 w-8 catalog-center justify-center rounded-lg border text-sm transition-colors';
  const btnNormal = `${btnBase} border-gray-200 text-gray-500 hover:border-brand-400 hover:text-brand-500 dark:border-gray-700 dark:text-gray-400 disabled:opacity-40`;
  const btnActive = `${btnBase} border-brand-500 bg-brand-500 text-white`;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[1150px]">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/[0.05]">
              <th
                onClick={() => handleSort('id')}
                className="w-16 cursor-pointer px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase select-none hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="flex items-center gap-1"># {renderSortIcon('id')}</span>
              </th>
              <th
                onClick={() => handleSort('id')}
                className="cursor-pointer px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase select-none hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="flex items-center gap-1">Derivación {renderSortIcon('id')}</span>
              </th>
              <th
                onClick={() => handleSort('document_id')}
                className="cursor-pointer px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase select-none hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="flex items-center gap-1">Trámite {renderSortIcon('document_id')}</span>
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Estado
              </th>
              <th className="w-40 px-5 py-4 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody
            className={`divide-y divide-gray-100 transition-opacity duration-200 dark:divide-white/[0.05] ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
          >
            {isLoading && routers.length === 0 ? (
              <TableSkeleton rows={6} cols={5} />
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-14 text-center text-sm text-gray-400">
                  No hay tramites
                </td>
              </tr>
            ) : (
              paginated.map((router) => (
                <tr key={router.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white/90">{router.id ?? '—'}</td>

                  <td className="px-5 py-5 align-top">
                    <div className="space-y-3">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400">
                          {router.document?.doc_contador ?? ''}/{getYear(router.document?.created_at) ?? ''}
                        </span>
                        <Tooltip content={copiedId === router.id ? 'Copiado' : 'Copiar'}>
                          <button
                            type="button"
                            onClick={() => handleCopy(router)}
                            className={`group relative inline-flex items-center justify-center rounded-md pl-0.5 text-sky-600 transition-colors duration-200 hover:bg-gray-100 hover:text-sky-700 dark:text-sky-400 dark:hover:bg-gray-800 ${
                              copiedId === router.id
                                ? 'scale-110 bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
                                : 'scale-100'
                            }`}
                          >
                            <CopyIcon className={`size-4`} />
                          </button>
                        </Tooltip>
                      </div>

                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {/*{router.priority_id && (*/}
                        {/*  <p>*/}
                        {/*    <span className="font-semibold text-sky-600 dark:text-sky-400">PRIORIDAD:</span>{' '}*/}
                        {/*    <PriorityBadge priorityId={router.priority_id} />*/}
                        {/*  </p>*/}
                        {/*)}*/}
                        {/*{router.rout_cite_document && (*/}
                        {/*  <p>*/}
                        {/*    <span className="font-semibold text-sky-600 dark:text-sky-400">CITE:</span>{' '}*/}
                        {/*    {router.rout_cite_document}*/}
                        {/*  </p>*/}
                        {/*)}*/}
                        {/*{router.rout_numero_cite && (*/}
                        {/*  <p>*/}
                        {/*    <span className="font-semibold text-sky-600 dark:text-sky-400">NRO CITE:</span>{' '}*/}
                        {/*    {router.rout_numero_cite}*/}
                        {/*  </p>*/}
                        {/*)}*/}
                        {router.department_id_origen && (
                          <p>
                            <span className="font-semibold text-sky-600 dark:text-sky-400">DE:</span>{' '}
                            {getDeparmentNameById(router.department_id_origen)}
                          </p>
                        )}
                        {router.department_id_destino && (
                          <p>
                            <span className="font-semibold text-sky-600 dark:text-sky-400">PARA:</span>{' '}
                            {getDeparmentNameById(router.department_id_destino)}
                          </p>
                        )}
                        {router.rout_remite_document && (
                          <p>
                            <span className="font-semibold text-sky-600 dark:text-sky-400">REMITE:</span>{' '}
                            {router.rout_remite_document}
                          </p>
                        )}
                        {router.priority_id && (
                          <p>
                            <span className="font-semibold text-sky-600 dark:text-sky-400">PRIORIDAD:</span>{' '}
                            <PriorityBadge priorityId={router.priority_id} />
                          </p>
                        )}
                        {router.type_document_id && (
                          <p>
                            <span className="font-semibold text-sky-600 dark:text-sky-400">TIPO DOCUMENTO:</span>{' '}
                            {getNameById(router.type_document_id)}
                          </p>
                        )}
                        {/*{router.rout_referencia_document && (*/}
                        {/*  <p>*/}
                        {/*    <span className="font-semibold text-sky-600 dark:text-sky-400">OBJETO/REFERENCIA:</span>{' '}*/}
                        {/*    {router.rout_referencia_document}*/}
                        {/*  </p>*/}
                        {/*)}*/}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 align-top">
                    <div className="space-y-3">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:text-brand-400 dark:bg-brand-500/10 rounded-full border px-3 py-1 text-xs font-medium">
                          {router.document?.doc_contador ?? ''}/{getYear(router.document?.created_at) ?? ''}
                        </span>
                        <Tooltip content={copiedId === router.document_id ? 'Copiado' : 'Copiar'}>
                          <button
                            type="button"
                            onClick={() => handleCopy(router.document)}
                            className={`group text-brand-600 hover:text-brand-700 dark:text-brand-400 relative inline-flex items-center justify-center rounded-md pl-0.5 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                              copiedId === router.document_id
                                ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 scale-110'
                                : 'scale-100'
                            }`}
                          >
                            <CopyIcon className={`size-4`} />
                          </button>
                        </Tooltip>
                      </div>

                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {router.document?.doc_numero_cite && (
                          <p>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">
                              NRO TRAMITE ANTIGUO:
                            </span>{' '}
                            {router.document?.id}
                          </p>
                        )}
                        {router.document?.priority_id && (
                          <p>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">PRIORIDAD:</span>{' '}
                            <PriorityBadge priorityId={router.document.priority_id} />
                          </p>
                        )}
                        {router.document?.doc_procedencia && (
                          <p>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">PROCEDENCIA:</span>{' '}
                            {getNameByValue(router.document?.doc_procedencia)}
                          </p>
                        )}
                        {router.document?.doc_remite && (
                          <p>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">REMITE:</span>{' '}
                            {router.document?.doc_remite}
                          </p>
                        )}
                        {router.document?.doc_cite && (
                          <p>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">CITE:</span>{' '}
                            {router.document?.doc_cite}
                          </p>
                        )}
                        {router.document?.doc_numero_cite && (
                          <p>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">NRO CITE:</span>{' '}
                            {router.document?.doc_numero_cite}
                          </p>
                        )}
                        {router.document?.type_document_id && (
                          <p>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">TIPO DOCUMENTO:</span>{' '}
                            {getNameById(router.document?.type_document_id)}
                          </p>
                        )}
                        {router.document?.doc_referencia && (
                          <p>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">OBJETO/REFERENCIA:</span>{' '}
                            {router.document?.doc_referencia}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                    <StateDocumentBadge stateDocumentId={router.state_document_id} />
                  </td>

                  <td className="px-5 py-5 align-top">
                    <div className="flex items-center justify-center gap-3">
                      {can('files.view') && onView && (
                        <Tooltip content="Ver tramite">
                          <Button
                            variant="ghost-outline"
                            size="xs"
                            onClick={() => onView(router)}
                            startIcon={<EyeIcon className="size-3.5 fill-blue-500 dark:fill-blue-400" />}
                          ></Button>
                        </Tooltip>
                      )}
                      {can('files.routes') && onViewRoutes && (
                        <Tooltip content="Ver rutas">
                          <Button
                            variant="primary-outline"
                            size="xs"
                            onClick={() => onViewRoutes(router)}
                            startIcon={<RouteIcon className="size-3.5" />}
                          ></Button>
                        </Tooltip>
                      )}
                      {can('files.unarchive') && onUnarchive && (
                        <Tooltip content="Desarchivar">
                          <Button
                            variant="info-outline"
                            size="xs"
                            startIcon={<ArchiveRestoreIcon className="size-3.5" />}
                            onClick={() => onUnarchive(router.id)}
                          ></Button>
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
