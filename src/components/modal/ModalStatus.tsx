import { Modal } from '../ui/modal';

interface ModalStatusProps {
  isOpen: boolean;
  active: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function ModalStatus({
  isOpen,
  active,
  title,
  message,
  loading = false,
  onClose,
  onConfirm,
}: ModalStatusProps) {
  const isActivating = active;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm p-6">
      <div className="text-center">
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
            isActivating ? 'bg-success-50 dark:bg-success-500/10' : 'bg-warning-50 dark:bg-warning-500/10'
          }`}
        >
          <svg
            className={`size-6 ${isActivating ? 'text-success-500' : 'text-warning-500'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isActivating ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
              />
            )}
          </svg>
        </div>

        <h4 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">
          {title || (isActivating ? '¿Activar registro?' : '¿Inactivar registro?')}
        </h4>

        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {message || (isActivating ? 'El registro será activado.' : 'El registro será inactivado.')}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm text-gray-700 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm text-white ${
              isActivating ? 'bg-success-500 hover:bg-success-600' : 'bg-warning-500 hover:bg-warning-600'
            }`}
          >
            {loading ? (isActivating ? 'Activando...' : 'Inactivando...') : isActivating ? 'Activar' : 'Inactivar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
