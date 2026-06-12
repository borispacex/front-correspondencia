import { Modal } from '../ui/modal';
import Button from '../ui/button/Button.tsx';

type ConfirmVariant = 'info' | 'warning' | 'success' | 'primary' | 'danger' | 'purple' | 'action';

interface Props {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  loadingText?: string;
  variant?: ConfirmVariant;
  icon?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const variantIconStyle: Record<ConfirmVariant, { bg: string; color: string }> = {
  info: { bg: 'bg-sky-50 dark:bg-sky-500/10', color: 'text-sky-500' },
  warning: { bg: 'bg-amber-50 dark:bg-amber-500/10', color: 'text-amber-500' },
  success: { bg: 'bg-green-50 dark:bg-green-500/10', color: 'text-green-500' },
  primary: { bg: 'bg-brand-50 dark:bg-brand-500/10', color: 'text-brand-500' },
  danger: { bg: 'bg-red-50 dark:bg-red-500/10', color: 'text-red-500' },
  purple: { bg: 'bg-violet-50 dark:bg-violet-500/10', color: 'text-violet-500' },
  action: { bg: 'bg-teal-50 dark:bg-teal-500/10', color: 'text-teal-500' },
};

const DefaultIcon = ({ variant }: { variant: ConfirmVariant }) => {
  const paths: Record<ConfirmVariant, string> = {
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    warning:
      'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    primary:
      'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    danger:
      'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    purple:
      'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    action: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
  };

  return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[variant]} />;
};

export default function ConfirmModal({
  isOpen,
  title = '¿Está seguro?',
  message = 'Esta acción requiere su confirmación.',
  confirmText = 'Confirmar',
  loadingText,
  variant = 'info',
  icon,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  const { bg, color } = variantIconStyle[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm p-6">
      <div className="text-center">
        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${bg}`}>
          {icon ?? (
            <svg className={`size-6 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <DefaultIcon variant={variant} />
            </svg>
          )}
        </div>

        <h4 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">{title}</h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{message}</p>

        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancelar
          </Button>

          <Button variant={variant} size="sm" type="button" onClick={onConfirm} disabled={loading}>
            {loading ? (loadingText ?? `${confirmText}...`) : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
