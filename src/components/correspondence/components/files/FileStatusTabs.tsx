export type DocumentStatusTab = 'all' | 'mine' | 'signed';

// Ajusta estos IDs según tu backend
export const MY_DOCUMENT_STATE_IDS = [1, 2, 3];
export const SIGNED_STATE_IDS = [4, 5];

interface TabCounts {
  all: number;
  mine: number;
  signed: number;
}

interface Props {
  active: DocumentStatusTab;
  counts: TabCounts;
  onChange: (tab: DocumentStatusTab) => void;
}

const TABS: { key: DocumentStatusTab; label: string }[] = [
  { key: 'mine', label: 'Mis documentos' },
  { key: 'signed', label: 'Firmados' },
  { key: 'all', label: 'Todos' },
];

export default function FileStatusTabs({ active, counts, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-2">
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
