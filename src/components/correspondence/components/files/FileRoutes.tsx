import { Document } from '../../types/documents/document.type.ts';
import { FileInputIcon } from '../../../../icons';

interface DocumentRoutesProps {
  document?: Document | null;
  isLoading?: boolean;
  isSelected?: boolean;
}

interface HistoryEvent {
  icon: 'cart' | 'card' | 'mail';
  title: string;
  subtitle: string;
  time: string;
  date: string;
}

const orderHistory: HistoryEvent[] = [
  {
    icon: 'cart',
    title: 'CNL. DAEN. MARIO RAUL SANDOVAL NAVA ',
    subtitle: 'UNIDAD DE TECNOLOGÍAS DE LA INFORMACIÓN Y COMUNICACIÓN',
    time: '12:54',
    date: '10/01/2025',
  },
  {
    icon: 'card',
    title: 'CNL. DAEN. JUAN MANUEL MOLINA PATIÑO',
    subtitle: 'Div. DE CUENTAS POR COBRAR',
    time: '12:58',
    date: '01/02/2025',
  },
  {
    icon: 'mail',
    title: 'CNL. DAEN. JESUS ARIEL ESPINOZA FERREL',
    subtitle: 'Dir. Nal. de Asuntos Administrativos y Financieros',
    time: '12:58',
    date: '15/03/2025',
  },
];

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={1.8}>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function IconCard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={1.8}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={1.8}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function HistoryIcon({ type }: { type: HistoryEvent['icon'] }) {
  const icons = {
    cart: <IconCart />,
    card: <IconCard />,
    mail: <IconMail />,
  };

  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
      {icons[type]}
    </div>
  );
}

const DocumentHistorySkeleton = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <SkeletonLine width="w-32" />

      <div className="mt-6 space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-white/[0.08]" />

            <div className="flex-1 space-y-2">
              <SkeletonLine width="w-32" />
              <SkeletonLine width="w-48" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2 border-t border-gray-200 pt-5 dark:border-white/[0.05]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-9 flex-1 animate-pulse rounded-lg bg-gray-200 dark:bg-white/[0.08]" />
        ))}
      </div>
    </div>
  );
};

const EmptyHistoryState = () => {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 dark:border-white/[0.08] dark:bg-white/[0.03]">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <FileInputIcon className="h-7 w-7 text-gray-400" />
        </div>

        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Ningún documento seleccionado</h3>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Selecciona un documento de la tabla para visualizar sus rutas.
        </p>
      </div>
    </div>
  );
};

const DocumentHistoryCard = ({ isSelected }: { isSelected: boolean }) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03] ${
        isSelected
          ? `border-brand-300 ring-brand-500/20 dark:border-brand-500/40 dark:ring-brand-500/30 shadow-sm ring-1`
          : `border-gray-100 hover:border-gray-200 dark:border-white/[0.05] dark:hover:border-white/[0.08]`
      } `}
    >
      <h2 className="mb-5 text-base font-semibold text-gray-800 dark:text-white/90">Rutas</h2>

      <div className="relative">
        <div className="absolute top-10 bottom-10 left-5 w-px bg-gray-200 dark:bg-white/[0.08]" />

        <div className="space-y-5">
          {orderHistory.map((event, i) => (
            <div key={i} className="relative flex items-start gap-4">
              <HistoryIcon type={event.icon} />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{event.title}</p>

                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{event.subtitle}</p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{event.time}</p>

                <p className="text-xs text-gray-400 dark:text-gray-500">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-2 border-t border-gray-200 pt-5 dark:border-white/[0.05]">
        {(['Cancelar', 'Derivar', 'Ver'] as const).map((label) => (
          <button
            key={label}
            className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-all duration-150 ${
              label === 'Ver'
                ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
                : 'border-gray-200 bg-transparent text-gray-600 hover:bg-gray-50 dark:border-white/[0.10] dark:text-gray-300 dark:hover:bg-white/[0.04]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

const SkeletonLine = ({ width }: { width: string }) => (
  <div className={`h-4 animate-pulse rounded bg-gray-200 dark:bg-white/[0.08] ${width}`} />
);

export const FileRoutes = ({ document, isLoading, isSelected = false }: DocumentRoutesProps) => {
  return (
    <>
      {isLoading ? (
        <DocumentHistorySkeleton />
      ) : !document ? (
        <EmptyHistoryState />
      ) : (
        <DocumentHistoryCard isSelected={isSelected} />
      )}
    </>
  );
};
