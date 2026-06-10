import { useMemo, useState } from 'react';
import { Document } from '../../../types/documents/document.type.ts';
import { usePermissions } from '../../../../../hooks/usePermissions.ts';
import {
  AngleDownIcon,
  AngleUpIcon,
  ArchiveIcon,
  ArchiveRestoreIcon,
  BadgeIcon,
  CalenderIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CopyIcon,
  EyeIcon,
  FileTextIcon,
  InboxIcon,
  MailIcon,
  PencilIcon,
  PrinterIcon,
  RouteIcon,
  SendHorizontalIcon,
  TrashBinIcon,
} from '../../../../../icons';
import TableSkeleton from '../../../../animation/TableSkeleton.tsx';
import Tooltip from '../../../../form/Tooltip.tsx';
import Button from '../../../../ui/button/Button.tsx';

interface Props {
  documents: Document[];
  isLoading?: boolean;
  onViewHeader?: (document: Document) => void;
  onViewRoutes?: (document: Document) => void;
  onDerive?: (document: Document) => void;
  onViewSheet?: (document: Document) => void;
  onView?: (document: Document) => void;
  onEdit?: (document: Document) => void;
  onDelete?: (id: number) => void;
  onArchive?: (id: number) => void;
  onUnarchive?: (id: number) => void;
  onReceive?: (id: number) => void;
}

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function PendingTable({
  documents,
  isLoading,
  onEdit,
  onDelete,
  onDerive,
  onViewHeader,
  onViewSheet,
  onViewRoutes,
  onView,
  onArchive,
  onUnarchive,
  onReceive,
}: Props) {
  const { can } = usePermissions();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortField, setSortField] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

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

  // ── Priority config ────────────────────────────────────────────────────────────
  const PRIORITY_CONFIG: Record<string, { label: string; cls: string }> = {
    NORMAL: { label: 'NORMAL', cls: 'bg-blue-100  text-blue-700  dark:bg-blue-900/40  dark:text-blue-300' },
    URGENTE: { label: 'URGENTE', cls: 'bg-red-100   text-red-700   dark:bg-red-900/40   dark:text-red-300' },
  };

  function PriorityBadge({ priority }: { priority?: string }) {
    const cfg = PRIORITY_CONFIG[priority ?? 'NORMAL'] ?? PRIORITY_CONFIG.NORMAL;
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${cfg.cls}`}
      >
        <BadgeIcon />
        {cfg.label}
      </span>
    );
  }

  // ── Copy ───────────────────────────────────────────────────────────────────
  const [copiedId, setCopiedId] = useState<number | null>(null);

  async function handleCopy(document: Document) {
    try {
      await navigator.clipboard.writeText(String(document.doc_contador ?? document.id));
      setCopiedId(document.id);
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
                onClick={() => handleSort('doc_contador')}
                className="cursor-pointer px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase select-none hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="flex items-center gap-1">Trámite {renderSortIcon('doc_contador')}</span>
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Derivado por
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
              <TableSkeleton rows={6} cols={4} />
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-14 text-center text-sm text-gray-400">
                  No hay documentos pendientes
                </td>
              </tr>
            ) : (
              paginated.map((document) => (
                <tr key={document.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                    {document.id ?? '—'}
                  </td>

                  <td className="px-5 py-5 align-top">
                    <div className="space-y-3">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:text-brand-400 dark:bg-brand-500/10 rounded-full border px-3 py-1 text-xs font-medium">
                          {document.doc_contador ?? document.id}
                        </span>
                        <Tooltip content={copiedId === document.id ? 'Copiado' : 'Copiar'}>
                          <button
                            type="button"
                            onClick={() => handleCopy(document)}
                            className={`group text-brand-600 hover:text-brand-700 dark:text-brand-400 relative inline-flex items-center justify-center rounded-md pl-0.5 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                              copiedId === document.id
                                ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 scale-110'
                                : 'scale-100'
                            }`}
                          >
                            <CopyIcon className={`size-4`} />
                          </button>
                        </Tooltip>
                      </div>

                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {document.priority_id && (
                          <p>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">PRIORIDAD:</span>{' '}
                            <PriorityBadge priority={document.priority_id === 1 ? 'URGENTE' : 'NORMAL'} />
                          </p>
                        )}
                        {document.doc_cite && (
                          <p>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">CITE:</span>{' '}
                            {document.doc_numero_cite}
                          </p>
                        )}
                        {document.doc_dep_name && (
                          <p>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">PROCEDENCIA:</span>{' '}
                            {document.doc_dep_name}
                          </p>
                        )}
                        {document.doc_remite && (
                          <p>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">REMITENTE:</span>{' '}
                            {document.doc_remite}
                          </p>
                        )}
                        {document.typ_name && (
                          <p>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">TIPO:</span>{' '}
                            {document.typ_name}
                          </p>
                        )}
                        {document.doc_referencia && (
                          <p>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">OBJETO/REFERENCIA:</span>{' '}
                            {document.doc_referencia}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5 align-top">
                    <div className="space-y-3">
                      {document.id % 2 == 0 ? (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          <p>CRISTIAN MACELO MAMANI VIDES</p>
                          <p>JEFE DE GESTON Y ASISTENCIA TECNOLOGICA</p>
                          <p>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">Asunto:</span> Para su
                            atencion
                          </p>
                          <p className="flex items-center gap-2">
                            <CalenderIcon className="text-brand-600 dark:text-brand-400 size-4" />
                            <span>01/05/2026</span>
                          </p>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          <p>Sin derivaciones.</p>
                          <p className="flex items-center gap-2">
                            <MailIcon className="text-brand-600 dark:text-brand-400 size-4" />
                            <span>Tienes 1 documento pendiente.</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-5 align-top">
                    <div className="flex items-center justify-center gap-3">
                      {can('files.view') && onView && (
                        <Tooltip content="Ver tramite">
                          <Button
                            variant="ghost-outline"
                            size="xs"
                            onClick={() => onView(document)}
                            startIcon={<EyeIcon className="size-3.5 fill-blue-500 dark:fill-blue-400" />}
                          ></Button>
                        </Tooltip>
                      )}
                      {can('files.edit') && onViewHeader && (
                        <Tooltip content="Cabecera de ruta">
                          <Button
                            variant="secondary-outline"
                            size="xs"
                            startIcon={<FileTextIcon className="size-3.5" />}
                            onClick={() => onViewHeader(document)}
                          ></Button>
                        </Tooltip>
                      )}
                      {can('files.edit') && onViewSheet && (
                        <Tooltip content="Hoja de ruta">
                          <Button
                            variant="secondary-outline"
                            size="xs"
                            startIcon={<PrinterIcon className="size-3.5" />}
                            onClick={() => onViewSheet(document)}
                          ></Button>
                        </Tooltip>
                      )}

                      {can('files.routes') && onViewRoutes && (
                        <Tooltip content="Ver rutas">
                          <Button
                            variant="primary-outline"
                            size="xs"
                            onClick={() => onViewRoutes(document)}
                            startIcon={<RouteIcon className="size-3.5" />}
                          ></Button>
                        </Tooltip>
                      )}

                      {can('files.edit') && onEdit && (
                        <Tooltip content="Editar">
                          <Button
                            variant="action-outline"
                            size="xs"
                            onClick={() => onEdit(document)}
                            startIcon={<PencilIcon className="size-3.5" />}
                          ></Button>
                        </Tooltip>
                      )}
                      {can('files.derive') && onDerive && (
                        <Tooltip content="Derivar">
                          <Button
                            variant="success-outline"
                            size="xs"
                            startIcon={<SendHorizontalIcon className="size-3.5" />}
                            onClick={() => onDerive(document)}
                          ></Button>
                        </Tooltip>
                      )}
                      {can('files.delete') && onDelete && (
                        <Tooltip content="Eliminar">
                          <Button
                            variant="danger-outline"
                            size="xs"
                            startIcon={<TrashBinIcon className="size-3.5" />}
                            onClick={() => onDelete(document.id)}
                          ></Button>
                        </Tooltip>
                      )}
                      {can('files.archive') && onArchive && (
                        <Tooltip content="Archivar">
                          <Button
                            variant="info-outline"
                            size="xs"
                            startIcon={<ArchiveIcon className="size-3.5" />}
                            onClick={() => onArchive(document.id)}
                          ></Button>
                        </Tooltip>
                      )}
                      {can('files.unarchive') && onUnarchive && (
                        <Tooltip content="Desarchivar">
                          <Button
                            variant="info-outline"
                            size="xs"
                            startIcon={<ArchiveRestoreIcon className="size-3.5" />}
                            onClick={() => onUnarchive(document.id)}
                          ></Button>
                        </Tooltip>
                      )}
                      {can('files.receive') && onReceive && (
                        <Tooltip content="Recibir">
                          <Button
                            variant="info-outline"
                            size="xs"
                            startIcon={<InboxIcon className="size-3.5" />}
                            onClick={() => onReceive(document.id)}
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
