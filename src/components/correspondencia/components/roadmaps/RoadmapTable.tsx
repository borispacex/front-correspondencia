import { useState, useMemo } from "react";
import {usePermissions} from "../../../../hooks/usePermissions.ts";
import {Roadmap} from "../../../../types/roadmaps/roadmap.type.ts";
import {
    ArchiveRestoreIcon, BadgeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon, CopyIcon,
    EyeIcon, FileIcon, FileInputIcon, FileTextIcon, PencilIcon, RouteIcon, SendHorizontalIcon, TrashBinIcon
} from "../../../../icons";
import Tooltip from "../../../form/Tooltip.tsx";
import Button from "../../../ui/button/Button.tsx";
import {formatDateBo} from "../../../../utils/format.utils.ts";

const PRIORITY_CONFIG: Record<string, { label: string; cls: string }> = {
    NORMAL:  { label: "NORMAL",  cls: "bg-blue-100  text-blue-700  dark:bg-blue-900/40  dark:text-blue-300"  },
    URGENTE: { label: "URGENTE", cls: "bg-red-100   text-red-700   dark:bg-red-900/40   dark:text-red-300"   },
    ALTO:    { label: "ALTO",    cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
};

function PriorityBadge({ priority }: { priority?: string }) {
    const cfg = PRIORITY_CONFIG[priority ?? "NORMAL"] ?? PRIORITY_CONFIG.NORMAL;
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cfg.cls}`}>
      <BadgeIcon />
            {cfg.label}
    </span>
    );
}

function Avatar({ name }: { name?: string }) {
    const initials = (name ?? "?")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    const colors = [
        "bg-violet-500", "bg-sky-500", "bg-emerald-500",
        "bg-rose-500",   "bg-amber-500","bg-teal-500",
    ];
    const color = colors[(name?.charCodeAt(0) ?? 0) % colors.length];
    return (
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${color}`}>
      {initials}
    </span>
    );
}

function DeletedBanner({ onRestore, canRestore }: { onRestore: () => void; canRestore: boolean }) {
    return (
        <div className="flex items-center gap-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span className="font-medium">Este documento fue eliminado</span>
            {canRestore && (
                <Button
                    variant="primary"
                    size="xs"
                    onClick={onRestore}
                    className="ml-auto inline-flex items-center gap-1.5"
                >
                    <ArchiveRestoreIcon className="size-3.5" />
                    Activar
                </Button>
            )}
        </div>
    );
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface RoadmapTableProps {
    roadmaps: Roadmap[];
    isLoading?: boolean;
    onEdit: (roadmap: Roadmap) => void;
    onDelete: (id: number) => void;
    onToggleActive: (item: Roadmap, active: boolean) => void;
    onDerive?: (roadmap: Roadmap) => void;
    onViewHeader?: (roadmap: Roadmap) => void;
    onViewSheet?: (roadmap: Roadmap) => void;
    onViewRoutes?: (roadmap: Roadmap) => void;
}

const PER_PAGE_OPTIONS = [10, 25, 50, 100];


export default function RoadmapTable({
                                         roadmaps,
                                         isLoading,
                                         onEdit,
                                         onDelete,
                                         onToggleActive,
                                         onDerive,
                                         onViewHeader,
                                         onViewSheet,
                                         onViewRoutes,
                                     }: RoadmapTableProps) {
    const { can } = usePermissions();

    // Filters
    const [filterNro, setFilterNro]           = useState("");
    const [filterOld, setFilterOld]           = useState("");
    const [filterOrigin, setFilterOrigin]     = useState("");
    const [filterSubject, setFilterSubject]   = useState("");
    const [filterPriority, setFilterPriority] = useState("");

    // Pagination / sort
    const [page, setPage]       = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [sortField, setSortField] = useState("id");
    const [sortDir, setSortDir]     = useState<"asc" | "desc">("desc");

    // ── Filtering ──────────────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        const nro      = filterNro.toLowerCase();
        const old      = filterOld.toLowerCase();
        const origin   = filterOrigin.toLowerCase();
        const subject  = filterSubject.toLowerCase();
        const priority = filterPriority.toLowerCase();

        return roadmaps.filter((r) => {
            const nroMatch      = !nro      || String(r.nro ?? r.id).toLowerCase().includes(nro);
            const oldMatch      = !old      || String(r.nro_tramite_antiguo ?? "").toLowerCase().includes(old);
            const originMatch   = !origin   || (r.procedencia ?? "").toLowerCase().includes(origin);
            const subjectMatch  = !subject  || (r.objeto_referencia ?? r.name ?? "").toLowerCase().includes(subject);
            const priorityMatch = !priority || (r.prioridad ?? "normal").toLowerCase().includes(priority);
            return nroMatch && oldMatch && originMatch && subjectMatch && priorityMatch;
        });
    }, [roadmaps, filterNro, filterOld, filterOrigin, filterSubject, filterPriority]);

    // ── Sorting ────────────────────────────────────────────────────────────────
    const sorted = useMemo(() => {
        if (!sortField) return filtered;
        return [...filtered].sort((a, b) => {
            const aVal = String(a[sortField as keyof Roadmap] ?? "");
            const bVal = String(b[sortField as keyof Roadmap] ?? "");
            const cmp  = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: "base" });
            return sortDir === "asc" ? cmp : -cmp;
        });
    }, [filtered, sortField, sortDir]);

    // ── Pagination ─────────────────────────────────────────────────────────────
    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const safePage   = Math.min(page, totalPages);
    const paged      = sorted.slice((safePage - 1) * perPage, safePage * perPage);
    const total      = filtered.length;
    const from       = total === 0 ? 0 : (safePage - 1) * perPage + 1;
    const to         = Math.min(safePage * perPage, total);

    function renderPageNumbers(): (number | "...")[] {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages: (number | "...")[] = [1];
        if (safePage > 3) pages.push("...");
        for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
        if (safePage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    }

    // ── Styles ─────────────────────────────────────────────────────────────────
    const btnBase   = "inline-flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition-colors";
    const btnNormal = `${btnBase} border-gray-200 text-gray-500 hover:border-brand-400 hover:text-brand-500 dark:border-gray-700 dark:text-gray-400 disabled:opacity-40`;
    const btnActive = `${btnBase} border-brand-500 bg-brand-500 text-white`;

    // ── Skeleton card ──────────────────────────────────────────────────────────
    function SkeletonCard() {
        return (
            <div className="animate-pulse rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/[0.05] dark:bg-white/[0.02]">
                <div className="flex items-start gap-3">
                    <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-3 w-72 rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-3 w-56 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div className="h-3 w-28 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="mt-3 flex gap-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-7 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
                    ))}
                </div>
            </div>
        );
    }

    const [copiedId, setCopiedId] = useState<number | null>(null);
    async function handleCopy(roadmap: Roadmap) {
        try {
            await navigator.clipboard.writeText(
                String(roadmap.nro ?? roadmap.id)
            );

            setCopiedId(roadmap.id);

            setTimeout(() => {
                setCopiedId(null);
            }, 1800);

        } catch (error) {
            console.error("Error copying", error);
        }
    }

    // ── Card row ───────────────────────────────────────────────────────────────
    function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
        const isDeleted = !roadmap.active;

        return (
            <div className={`rounded-xl border p-4 transition-shadow hover:shadow-sm ${
                isDeleted
                    ? "border-red-100 bg-red-50/30 dark:border-red-900/20 dark:bg-red-900/5"
                    : "border-gray-100 bg-white hover:border-gray-200 dark:border-white/[0.05] dark:bg-white/[0.02] dark:hover:border-white/[0.08]"
            }`}>

                <div className="flex flex-wrap items-start justify-between gap-3">

                    <div className="flex min-w-0 flex-1 items-start gap-3">
                        <Avatar name={roadmap.remitente ?? roadmap.name} />
                        <div className="min-w-0">

                            <div className="mb-1 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
                                  {roadmap.nro ?? roadmap.id}
                                </span>

                                <Tooltip content={copiedId === roadmap.id ? "Copiado" : "Copiar"}>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(roadmap)}
                                        className={`group relative inline-flex items-center justify-center rounded-md pl-0.5 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                            copiedId === roadmap.id
                                                ? "scale-110 bg-green-100 dark:bg-green-900/30"
                                                : "scale-100"
                                        }`}
                                    >
                                        <CopyIcon
                                            className={`size-4 transition-all duration-200 ${
                                                copiedId === roadmap.id
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                                                }
                                            `}
                                        />
                                    </button>
                                </Tooltip>

                            </div>

                            {roadmap.prioridad && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    <span className="font-medium text-gray-600 dark:text-gray-300">PRIORIDAD:</span>{" "}
                                    <PriorityBadge priority={roadmap.prioridad} />
                                </p>
                            )}

                            {roadmap.nro_tramite_antiguo && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    <span className="font-medium text-gray-600 dark:text-gray-300">NRO TRAMITE ANTIGUO:</span>{" "}
                                    {roadmap.nro_tramite_antiguo}
                                </p>
                            )}

                            {roadmap.procedencia && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    <span className="font-medium text-gray-600 dark:text-gray-300">PROCEDENCIA:</span>{" "}
                                    {roadmap.procedencia}
                                </p>
                            )}

                            {(roadmap.objeto_referencia ?? roadmap.name) && (
                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium text-gray-600 dark:text-gray-300">OBJETO/REFERENCIA: </span>{" "}
                                    {roadmap.objeto_referencia ?? roadmap.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <span className="shrink-0 whitespace-nowrap text-right text-xs text-gray-400 dark:text-gray-500">
                        {roadmap.fecha ? formatDateBo(roadmap.fecha) : "—"}
                    </span>
                </div>

                {isDeleted && (
                    <div className="mt-3">
                        <DeletedBanner
                            onRestore={() => onToggleActive(roadmap, true)}
                            canRestore={can("roadmaps.edit")}
                        />
                    </div>
                )}

                {!isDeleted && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {roadmap.has_routes && onViewRoutes && (
                            <Tooltip content="Ver rutas">
                                <Button
                                    variant="secondary"
                                    size="xs"
                                    startIcon={<RouteIcon className="size-3.5" />}
                                    onClick={() => onViewRoutes(roadmap)}
                                >
                                    Ver rutas
                                </Button>
                            </Tooltip>
                        )}

                        {/* Permission-gated action buttons */}
                        {can("roadmaps.edit") && onViewHeader && (
                            <Tooltip content="Cabecera de ruta">
                                <Button
                                    variant="secondary"
                                    size="xs"
                                    startIcon={<FileTextIcon className="size-3.5" />}
                                    onClick={() => onViewHeader(roadmap)}
                                >
                                    Cabecera de ruta
                                </Button>
                            </Tooltip>
                        )}

                        {can("roadmaps.edit") && onViewSheet && (
                            <Tooltip content="Hoja de ruta">
                                <Button
                                    variant="secondary"
                                    size="xs"
                                    startIcon={<FileInputIcon className="size-3.5" />}
                                    onClick={() => onViewSheet(roadmap)}
                                >
                                    Hoja de ruta
                                </Button>
                            </Tooltip>
                        )}

                        {can("roadmaps.edit") && onDerive && (
                            <Tooltip content="Derivar">
                                <Button
                                    variant="success"
                                    size="xs"
                                    startIcon={<SendHorizontalIcon className="size-3.5" />}
                                    onClick={() => onDerive(roadmap)}
                                >
                                    Derivar
                                </Button>
                            </Tooltip>
                        )}

                        {can("roadmaps.edit") && (
                            <Tooltip content="Ver">
                                <Button
                                    variant="icon"
                                    size="xs"
                                    onClick={() => onEdit(roadmap)}
                                    startIcon={<EyeIcon className="fill-gray-600 dark:fill-gray-300 size-3.5" />}
                                >
                                    Ver
                                </Button>
                            </Tooltip>
                        )}

                        {can("roadmaps.edit") && (
                            <Tooltip content="Editar">
                                <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={() => onEdit(roadmap)}
                                    startIcon={<PencilIcon className="size-3.5" />}
                                >
                                    Editar
                                </Button>
                            </Tooltip>
                        )}

                        {can("roadmaps.delete") && (
                            <Tooltip content="Eliminar">
                                <Button
                                    variant="danger"
                                    size="xs"
                                    startIcon={<TrashBinIcon className="size-3.5" />}
                                    onClick={() => onDelete(roadmap.id)}
                                >
                                    Eliminar
                                </Button>
                            </Tooltip>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {isLoading && roadmaps.length === 0 ? (
                    [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
                ) : paged.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-transparent">
                        <FileIcon className="size-10 text-gray-300 dark:text-gray-600" />
                        <p className="text-sm font-medium text-gray-400 dark:text-gray-500">No hay documentos registrados</p>
                    </div>
                ) : (
                    paged.map((roadmap) => (
                        <div
                            key={roadmap.id}
                            className={`transition-opacity duration-200 ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                        >
                            <RoadmapCard roadmap={roadmap} />
                        </div>
                    ))
                )}
            </div>

            {!isLoading && total > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 dark:border-white/[0.05] dark:bg-white/[0.02]">
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span>Filas por página:</span>
                        <select
                            value={perPage}
                            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 focus:border-brand-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        >
                            {PER_PAGE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <span className="text-xs">{from}–{to} de {total}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <button onClick={() => setPage(1)} disabled={safePage === 1} className={btnNormal} title="Primera">
                            <ChevronsLeftIcon />
                        </button>
                        <button onClick={() => setPage(safePage - 1)} disabled={safePage === 1} className={btnNormal} title="Anterior">
                            <ChevronLeftIcon />
                        </button>

                        {renderPageNumbers().map((p, i) =>
                            p === "..." ? (
                                <span key={`e-${i}`} className="inline-flex h-8 w-8 items-center justify-center text-sm text-gray-400">…</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => setPage(p as number)}
                                    className={p === safePage ? btnActive : btnNormal}
                                >
                                    {p}
                                </button>
                            )
                        )}

                        <button onClick={() => setPage(safePage + 1)} disabled={safePage === totalPages} className={btnNormal} title="Siguiente">
                            <ChevronRightIcon />
                        </button>
                        <button onClick={() => setPage(totalPages)} disabled={safePage === totalPages} className={btnNormal} title="Última">
                            <ChevronsRightIcon />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
