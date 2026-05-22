import PageMeta from "../../common/PageMeta.tsx";
import PageBreadCrumb from "../../common/PageBreadCrumb.tsx";
import Button from "../../ui/button/Button.tsx";
import {PlusIcon} from "../../../icons";
import {usePermissions} from "../../../hooks/usePermissions.ts";
import {useNotifications} from "../../../hooks/useNotification.tsx";
import {useState} from "react";
import type {User} from "../../../types/users/user.types.ts";
import {RoadmapTable} from "../components/roadmaps/RoadmapTable.tsx";

interface OrderItem {
    id: number;
    product: string;
    quantity: number;
    unitCost: number;
    discount: number;
}

interface HistoryEvent {
    icon: "cart" | "card" | "mail";
    title: string;
    subtitle: string;
    time: string;
    date: string;
}

const orderItems: OrderItem[] = [
    { id: 1, product: 'Macbook pro 13"', quantity: 1, unitCost: 1200, discount: 0 },
    { id: 2, product: "Apple Watch Ultra", quantity: 1, unitCost: 300, discount: 50 },
    { id: 3, product: "iPhone 15 Pro Max", quantity: 2, unitCost: 800, discount: 0 },
    { id: 4, product: "iPad Pro 3rd Gen", quantity: 1, unitCost: 900, discount: 0 },
];

const orderHistory: HistoryEvent[] = [
    { icon: "cart", title: "Checkout Started", subtitle: "via tailadmin.com", time: "12:54", date: "12th Apr 28" },
    { icon: "card", title: "Purchased", subtitle: "for US$4,235 via PayPal", time: "12:58", date: "12th Apr 28" },
    { icon: "mail", title: "Receipt Email Sent", subtitle: "Receipt #1734535", time: "12:58", date: "12th Apr 28" },
];

function getTotal(item: OrderItem): number {
    const base = item.unitCost * item.quantity;
    return item.discount > 0 ? base * (1 - item.discount / 100) : base;
}

function fmt(n: number): string {
    return `$${n.toLocaleString("en-US")}`;
}

function IconCart() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
        </svg>
    );
}

function IconCard() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
    );
}

function IconMail() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    );
}

function HistoryIcon({ type }: { type: HistoryEvent["icon"] }) {
    const icons = { cart: <IconCart />, card: <IconCard />, mail: <IconMail /> };
    return (
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
            {icons[type]}
        </div>
    );
}

export const RoadmapPage = () => {

    const subTotal = orderItems.reduce((sum, item) => sum + getTotal(item), 0);
    const vat = Math.round(subTotal * 0.1);
    const total = subTotal + vat;

    const { can } = usePermissions();
    const { addNotification } = useNotifications();

    const [roadmaps, setRoadmaps] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selected, setSelected] = useState<User | null>(null);
    const [confirmId, setConfirmId] = useState<number | null>(null);

    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [selectedStatusItem, setSelectedStatusItem] = useState<User | null>(null);
    const [nextStatus, setNextStatus] = useState(false);

    function handleCreate() {
        setSelected(null);
        setIsModalOpen(true);
    }

    return (
        <>
            <PageMeta title="Usuarios" description="Gestión de usuarios del sistema" />
            <PageBreadCrumb pageTitle="Usuarios" />

            {/* ── Order ID bar ── */}
            <div className="space-y-5">
                <div className="rounded-2xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 flex-wrap">

                        buscador

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

                <RoadmapTable
                    // roadmaps={roadmaps}
                    // isLoading={isLoading}
                    // onEdit={handleEdit}
                    // onDelete={handleDelete}
                    // onToggleActive={handleToggleActive}
                />

                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">

                    {/* ── Order Details card ── */}
                    <div className="rounded-2xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03]">
                        a

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b border-gray-200 dark:border-white/[0.05]">
                                    {["S. No.", "Products", "Quantity", "Unit Cost", "Discount", "Total"].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {orderItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.id}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800 dark:text-white/90 whitespace-nowrap">{item.product}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.quantity}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{fmt(item.unitCost)}</td>
                                        <td className="px-6 py-4">
                                            {item.discount > 0 ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20">
                          {item.discount}%
                        </span>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500">0%</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white/90">
                                            {fmt(getTotal(item))}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Order Summary */}
                        <div className="px-6 py-5 border-t border-gray-200 dark:border-white/[0.05] flex justify-end">
                            <div className="w-64 space-y-2">
                                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                                    Order summary
                                </p>
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                                    <span>Sub Total</span>
                                    <span>{fmt(subTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                                    <span>Vat (10%):</span>
                                    <span>{fmt(vat)}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-gray-800 dark:text-white/90 pt-3 border-t border-gray-200 dark:border-white/[0.05]">
                                    <span>Total</span>
                                    <span className="text-blue-600 dark:text-blue-400 text-lg">{fmt(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right column ── */}
                    <div className="flex flex-col gap-5">

                        {/* Customer Details */}
                        <div className="rounded-2xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-6">
                            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-5">
                                Customer Details
                            </h2>
                            <div className="space-y-3">
                                {[
                                    { label: "Name",    value: "Mushafrof Chowdhury" },
                                    { label: "Email",   value: "name@example.com" },
                                    { label: "Phone",   value: "Mountain View, CA, 94040" },
                                    { label: "Phone",   value: "+123 456 7890" },
                                    { label: "Country", value: "United States" },
                                    { label: "Address", value: "62 Miles Drive St, Newark, NJ 07103, California." },
                                ].map(({ label, value }, i) => (
                                    <div key={i} className="flex justify-between gap-4">
                                        <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 w-14">{label}</span>
                                        <span className="text-sm text-gray-700 dark:text-gray-200 text-right">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order History */}
                        <div className="rounded-2xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-6">
                            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-5">
                                Order History
                            </h2>

                            <div className="relative">
                                {/* vertical line */}
                                <div className="absolute left-5 top-10 bottom-10 w-px bg-gray-100 dark:bg-white/[0.05]" />
                                <div className="space-y-5">
                                    {orderHistory.map((event, i) => (
                                        <div key={i} className="flex gap-4 items-start relative">
                                            <HistoryIcon type={event.icon} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{event.title}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{event.subtitle}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{event.time}</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">{event.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 mt-6 pt-5 border-t border-gray-200 dark:border-white/[0.05]">
                                {(["Resend", "Forward", "Preview"] as const).map((label) => (
                                    <button
                                        key={label}
                                        className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all duration-150 ${
                                            label === "Preview"
                                                ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                                                : "bg-transparent border-gray-200 dark:border-white/[0.10] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
