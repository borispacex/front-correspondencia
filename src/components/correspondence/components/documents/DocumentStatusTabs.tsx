interface TabCounts {
  all: number;
  pending: number;
  attended: number;
  archived: number;
}

export type DocumentStatusTab = 'all' | 'pending' | 'attended' | 'archived';

interface DocumentStatusTabsProps {
  active: DocumentStatusTab;
  counts: TabCounts;
  onChange: (tab: DocumentStatusTab) => void;
}

// IDs de state_documents que corresponden a cada tab
// Pendientes  → CREADO(1), En proceso(2)
// Atendidas   → ENVIADO(3), DERIVADO(4), RECIBIDO(5)
// Archivadas  → ARCIVADO(6), ARCHIVADO(7), ELIMINADO(8)
export const PENDING_STATE_IDS = [1, 2];
export const ATTENDED_STATE_IDS = [3, 4, 5];
export const ARCHIVED_STATE_IDS = [6, 7, 8];

const TABS: { key: DocumentStatusTab; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'attended', label: 'Atendidas' },
  { key: 'archived', label: 'Archivadas' },
];

export default function DocumentStatusTabs({ active, counts, onChange }: DocumentStatusTabsProps) {
  return (
    <div className="inline-flex flex-wrap items-center gap-0.5 rounded-xl border border-gray-200 bg-gray-100 p-1 dark:border-white/[0.05] dark:bg-white/[0.03]">
      {TABS.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all duration-150 ${
              isActive
                ? 'bg-white font-medium text-gray-800 shadow dark:bg-gray-800 dark:text-white'
                : 'font-normal text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {label}
            <span className="inline-flex h-5 min-w-[22px] items-center justify-center rounded-full bg-blue-100 px-1.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {counts[key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
