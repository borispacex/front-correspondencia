import { useMemo, useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  EyeIcon,
  FingerprintPatternIcon,
  RouteIcon,
} from '../../../../icons';
import { SignDocument } from '../../types/sign-document.type.ts';
import TableSkeleton from '../../../animation/TableSkeleton.tsx';

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
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const totalPages = Math.max(1, Math.ceil(documents.length / perPage));

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;

    return documents.slice(start, start + perPage);
  }, [documents, page, perPage]);

  const total = documents.length;

  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

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

              <th className="px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Documento
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Hoja de ruta
              </th>

              <th className="w-40 px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Fecha creación
              </th>

              <th className="w-52 px-5 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Acción realizada
              </th>

              <th className="w-40 px-5 py-4 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {isLoading ? (
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
                        <span className="border-success-200 bg-success-50 text-success-700 dark:border-success-500/20 dark:bg-success-500/10 dark:text-success-400 rounded-full border px-3 py-1 text-xs font-medium">
                          {document.code}
                        </span>

                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(document.code)}
                          className="text-success-600 hover:text-success-700 dark:text-success-400 transition-colors"
                        >
                          <CopyIcon className="size-4" />
                        </button>
                      </div>

                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-success-600 dark:text-success-400 font-semibold">Asunto:</span>{' '}
                        {document.subject}
                      </div>

                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-success-600 dark:text-success-400 font-semibold">Tipo:</span>{' '}
                        {document.documentType}
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
                      <button
                        type="button"
                        title="Firmar digital"
                        onClick={() => onApprove?.(document)}
                        className="text-success-600 hover:text-success-700 dark:text-success-400 transition-colors"
                      >
                        <FingerprintPatternIcon className="size-5" />
                      </button>

                      <button
                        type="button"
                        title="Rutas"
                        onClick={() => onTraceability?.(document)}
                        className="text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors"
                      >
                        <RouteIcon className="size-5" />
                      </button>

                      <button
                        type="button"
                        title="Ver documento"
                        onClick={() => onView?.(document)}
                        className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                      >
                        <EyeIcon className="size-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>Filas por página:</span>

            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="focus:border-brand-400 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              {PER_PAGE_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <span>
              {from}–{to} de {total}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="hover:border-brand-500 hover:text-brand-500 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors disabled:opacity-40 dark:border-gray-700 dark:text-gray-400"
            >
              <ChevronLeftIcon />
            </button>

            <span className="text-sm text-gray-500 dark:text-gray-400">
              Página {page} de {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="hover:border-brand-500 hover:text-brand-500 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors disabled:opacity-40 dark:border-gray-700 dark:text-gray-400"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
