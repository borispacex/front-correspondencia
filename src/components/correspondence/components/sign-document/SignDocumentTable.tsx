import { useMemo, useState } from 'react';
import {
  AngleDownIcon,
  AngleUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CopyIcon,
  EyeIcon,
  FingerprintPatternIcon,
  RouteIcon,
} from '../../../../icons';
import { SignDocument } from '../../types/sign-document.type.ts';
import TableSkeleton from '../../../animation/TableSkeleton.tsx';
import Tooltip from '../../../form/Tooltip.tsx';
import Button from '../../../ui/button/Button.tsx';
import { usePermissions } from '../../../../hooks/usePermissions.ts';

interface Props {
  documents: SignDocument[];
  isLoading?: boolean;
  onApprove?: (document: SignDocument) => void;
  onView?: (document: SignDocument) => void;
  onTraceability?: (document: SignDocument) => void;
  onSelect?: (ids: number[]) => void;
}

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function SignDocumentTable({
  documents,
  isLoading,
  onApprove,
  onView,
  onTraceability,
  onSelect,
}: Props) {
  const { can } = usePermissions();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [sortField, setSortField] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = useMemo(() => {
    if (!sortField) return documents;
    return [...documents].sort((a, b) => {
      const aVal = String(a[sortField as keyof SignDocument] ?? '');
      const bVal = String(b[sortField as keyof SignDocument] ?? '');
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

  function handleSelect(id: number, checked: boolean) {
    const updated = checked ? [...selectedIds, id] : selectedIds.filter((item) => item !== id);
    setSelectedIds(updated);
    onSelect?.(updated);
  }

  function handleSelectAll(checked: boolean) {
    const updated = checked ? paginated.map((item) => item.id) : [];
    setSelectedIds(updated);
    onSelect?.(updated);
  }

  const allSelected = paginated.length > 0 && paginated.every((item) => selectedIds.includes(item.id));

  const btnBase = 'inline-flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition-colors';
  const btnNormal = `${btnBase} border-gray-200 text-gray-500 hover:border-brand-400 hover:text-brand-500 dark:border-gray-700 dark:text-gray-400 disabled:opacity-40`;
  const btnActive = `${btnBase} border-brand-500 bg-brand-500 text-white`;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[1150px]">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/[0.05]">
              <th className="w-14 px-5 py-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="text-brand-500 focus:ring-brand-500 h-4 w-4 rounded border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                />
              </th>

              <th
                onClick={() => handleSort('code')}
                className="cursor-pointer px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase select-none hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="flex items-center gap-1">Documento {renderSortIcon('code')}</span>
              </th>

              <th
                onClick={() => handleSort('route')}
                className="cursor-pointer px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase select-none hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="flex items-center gap-1">Trámite {renderSortIcon('route')}</span>
              </th>

              <th
                onClick={() => handleSort('createdAt')}
                className="w-40 cursor-pointer px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase select-none hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="flex items-center gap-1">Fecha creación {renderSortIcon('createdAt')}</span>
              </th>

              <th
                onClick={() => handleSort('actionPerformed')}
                className="w-52 cursor-pointer px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase select-none hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="flex items-center gap-1">Acción realizada {renderSortIcon('actionPerformed')}</span>
              </th>

              <th className="w-40 px-5 py-4 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody
            className={`divide-y divide-gray-100 transition-opacity duration-200 dark:divide-white/[0.05] ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
          >
            {isLoading && documents.length === 0 ? (
              <TableSkeleton rows={6} cols={6} />
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-14 text-center text-sm text-gray-400">
                  No hay documentos pendientes
                </td>
              </tr>
            ) : (
              paginated.map((document) => (
                <tr key={document.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  <td className="px-5 py-5 align-top">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(document.id)}
                      onChange={(e) => handleSelect(document.id, e.target.checked)}
                      className="text-brand-500 focus:ring-brand-500 h-4 w-4 rounded border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                    />
                  </td>

                  <td className="px-5 py-5 align-top">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 dark:border-teal-500/20 dark:bg-teal-500/10 dark:text-teal-400">
                          {document.code}
                        </span>

                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(document.code)}
                          className="text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400"
                        >
                          <CopyIcon className="size-4" />
                        </button>
                      </div>

                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <p>
                          <span className="font-semibold text-teal-600 dark:text-teal-400">Asunto:</span>{' '}
                          {document.subject}
                        </p>
                        <p>
                          <span className="font-semibold text-teal-600 dark:text-teal-400">Tipo:</span>{' '}
                          {document.documentType}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5 align-top">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-400 rounded-full border px-3 py-1 text-xs font-medium">
                          {document.route.code}
                        </span>

                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(document.route.code)}
                          className="text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors"
                        >
                          <CopyIcon className="size-4" />
                        </button>
                      </div>

                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-brand-600 dark:text-brand-400 font-semibold">Asunto:</span>{' '}
                        {document.route.subject}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5 align-top text-sm text-gray-600 dark:text-gray-400">{document.createdAt}</td>

                  <td className="px-5 py-5 align-top text-sm text-gray-600 dark:text-gray-400">
                    {document.actionPerformed}
                  </td>

                  <td className="px-5 py-5 align-top">
                    <div className="flex items-center justify-center gap-3">
                      {can('documents.view') && (
                        <Tooltip content="Ver firma digital">
                          <Button
                            variant="ghost-outline"
                            size="xs"
                            onClick={() => onView?.(document)}
                            startIcon={<EyeIcon className="size-3.5 fill-blue-500 dark:fill-blue-400" />}
                          ></Button>
                        </Tooltip>
                      )}
                      {can('documents.routes') && (
                        <Tooltip content="Ver rutas">
                          <Button
                            variant="primary-outline"
                            size="xs"
                            onClick={() => onTraceability?.(document)}
                            startIcon={<RouteIcon className="size-3.5" />}
                          ></Button>
                        </Tooltip>
                      )}
                      {can('documents.sign') && (
                        <Tooltip content="Firmar">
                          <Button
                            variant="success-outline"
                            size="xs"
                            startIcon={<FingerprintPatternIcon className="size-3.5" />}
                            onClick={() => onApprove?.(document)}
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
