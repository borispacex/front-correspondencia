import PageMeta from "../../common/PageMeta.tsx";
import PageBreadCrumb from "../../common/PageBreadCrumb.tsx";
import Button from "../../ui/button/Button.tsx";
import {PlusIcon} from "../../../icons";
import {usePermissions} from "../../../hooks/usePermissions.ts";
import {useNotifications} from "../../../hooks/useNotification.tsx";
import {useMemo, useState} from "react";
import {Roadmap, RoadmapFilters, SortConfig} from "../../../types/roadmaps/roadmap.type.ts";
import RoadmapTable from "../components/roadmaps/RoadmapTable.tsx";
import {RoadmapShow} from "../components/roadmaps/RoadmapShow.tsx";
import {RoadmapFilter} from "../components/roadmaps/RoadmapFilter.tsx";

interface OrderItem {
    id: number;
    product: string;
    quantity: number;
    unitCost: number;
    discount: number;
}

const orderItems: OrderItem[] = [
    { id: 1, product: 'Macbook pro 13"', quantity: 1, unitCost: 1200, discount: 0 },
    { id: 2, product: "Apple Watch Ultra", quantity: 1, unitCost: 300, discount: 50 },
    { id: 3, product: "iPhone 15 Pro Max", quantity: 2, unitCost: 800, discount: 0 },
    { id: 4, product: "iPad Pro 3rd Gen", quantity: 1, unitCost: 900, discount: 0 },
];

function getTotal(item: OrderItem): number {
    const base = item.unitCost * item.quantity;
    return item.discount > 0 ? base * (1 - item.discount / 100) : base;
}

export const RoadmapPage = () => {

    const subTotal = orderItems.reduce((sum, item) => sum + getTotal(item), 0);
    const vat = Math.round(subTotal * 0.1);
    const total = subTotal + vat;

    const { can } = usePermissions();
    const { addNotification } = useNotifications();

    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selected, setSelected] = useState<Roadmap | null>(null);
    const [confirmId, setConfirmId] = useState<number | null>(null);

    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [selectedStatusItem, setSelectedStatusItem] = useState<Roadmap | null>(null);

    function handleCreate() {
        setSelected(null);
        setIsModalOpen(true);
    }

    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([
        {
            id: 1,
            nro: "HR-001",
            nro_tramite_antiguo: "TR-2023-55",
            procedencia: "RECTORADO",
            objeto_referencia: "Solicitud de revisión",
            prioridad: "URGENTE",
            remitente: "Juan Perez",
            fecha: "2026-05-25T10:00:00",
            active: false,
            has_routes: true,
        },
        {
            id: 2,
            nro: "HR-002",
            procedencia: "FINANZAS",
            objeto_referencia: "Pago pendiente lorem Pago pendiente lorem Pago pendiente lorem Pago pendiente lorem Pago pendiente lorem Pago pendiente lorem Pago pendiente lorem",
            prioridad: "NORMAL",
            remitente: "Maria Lopez",
            fecha: "2026-05-24T09:30:00",
            active: true,
            has_routes: false,
        },
    ]);

    // ─── Eventos ─────────────────────────────────────────

    const handleEdit = (roadmap: Roadmap) => {
        console.log("Editar:", roadmap);
    };

    const handleDelete = (id: number) => {
        console.log("Eliminar:", id);
    };

    const handleToggleActive = (item: Roadmap, active: boolean) => {
        console.log("Activar/Inactivar:", item, active);

        setRoadmaps((prev) =>
            prev.map((r) =>
                r.id === item.id
                    ? { ...r, active }
                    : r
            )
        );
    };

    const handleDerive = (roadmap: Roadmap) => {
        console.log("Derivar:", roadmap);
    };

    const handleViewHeader = (roadmap: Roadmap) => {
        console.log("Cabecera:", roadmap);
    };

    const handleViewSheet = (roadmap: Roadmap) => {
        console.log("Hoja:", roadmap);
    };

    const handleViewRoutes = (roadmap: Roadmap) => {
        console.log("Rutas:", roadmap);
    };

    // Filter
    const [filters, setFilters] = useState<RoadmapFilters>({
        nro: "",
        old: "",
        origin: "",
        subject: "",
        priority: "",
    });

    const [sort, setSort] = useState<SortConfig>({
        field: "id",
        dir: "desc",
    });
    const filteredRoadmaps = useMemo(() => {
        const filtered = roadmaps.filter((r) => {
            const nroMatch =
                !filters.nro ||
                String(r.nro ?? r.id)
                    .toLowerCase()
                    .includes(filters.nro.toLowerCase());

            const oldMatch =
                !filters.old ||
                String(r.nro_tramite_antiguo ?? "")
                    .toLowerCase()
                    .includes(filters.old.toLowerCase());

            const originMatch =
                !filters.origin ||
                (r.procedencia ?? "")
                    .toLowerCase()
                    .includes(filters.origin.toLowerCase());

            const subjectMatch =
                !filters.subject ||
                (r.objeto_referencia ?? r.name ?? "")
                    .toLowerCase()
                    .includes(filters.subject.toLowerCase());

            const priorityMatch =
                !filters.priority ||
                (r.prioridad ?? "normal")
                    .toLowerCase()
                    .includes(filters.priority.toLowerCase());

            return (
                nroMatch &&
                oldMatch &&
                originMatch &&
                subjectMatch &&
                priorityMatch
            );
        });

        return [...filtered].sort((a, b) => {
            const aVal = String(a[sort.field as keyof Roadmap] ?? "");
            const bVal = String(b[sort.field as keyof Roadmap] ?? "");

            const cmp = aVal.localeCompare(bVal, undefined, {
                numeric: true,
                sensitivity: "base",
            });

            return sort.dir === "asc" ? cmp : -cmp;
        });
    }, [roadmaps, filters, sort]);

    return (
        <>
            <PageMeta title="Usuarios" description="Gestión de usuarios del sistema" />
            <PageBreadCrumb pageTitle="Usuarios" />

            <div className="space-y-5">
                <div className="rounded-2xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 flex-wrap">
                        <RoadmapFilter
                            filters={filters}
                            sort={sort}
                            onFiltersChange={setFilters}
                            onSortChange={setSort}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {can("users.create") && (
                            <Button
                                size="sm"
                                onClick={handleCreate}
                                startIcon={<PlusIcon className="size-4 text-white" />}
                            >
                                Nueva Hoja de Ruta
                            </Button>
                        )}

                    </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">

                    <RoadmapTable
                        roadmaps={filteredRoadmaps}
                        isLoading={isLoading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleActive={handleToggleActive}
                        onDerive={handleDerive}
                        onViewHeader={handleViewHeader}
                        onViewSheet={handleViewSheet}
                        onViewRoutes={handleViewRoutes}
                    />
                    <RoadmapShow />
                </div>
            </div>
        </>
    );
}
