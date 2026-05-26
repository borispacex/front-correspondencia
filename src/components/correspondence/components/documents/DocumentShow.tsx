
interface HistoryEvent {
    icon: "cart" | "card" | "mail";
    title: string;
    subtitle: string;
    time: string;
    date: string;
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

function HistoryIcon({ type }: { type: HistoryEvent["icon"] }) {
    const icons = { cart: <IconCart />, card: <IconCard />, mail: <IconMail /> };
    return (
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
            {icons[type]}
        </div>
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

const orderHistory: HistoryEvent[] = [
    { icon: "cart", title: "Checkout Started", subtitle: "via tailadmin.com", time: "12:54", date: "12th Apr 28" },
    { icon: "card", title: "Purchased", subtitle: "for US$4,235 via PayPal", time: "12:58", date: "12th Apr 28" },
    { icon: "mail", title: "Receipt Email Sent", subtitle: "Receipt #1734535", time: "12:58", date: "12th Apr 28" },
];

export const DocumentShow = () => {



    return(
        <>
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
        </>
    )
}