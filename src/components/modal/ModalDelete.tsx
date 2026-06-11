import { Modal } from '../ui/modal';

interface Props {
  isOpen: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function ModalDelete({
  isOpen,
  title = '¿Eliminar registro?',
  message = 'Esta acción no se puede deshacer.',
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm p-6">
      <div className="text-center">
        <div className="bg-error-50 dark:bg-error-500/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
          <svg className="text-error-500 size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h4 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">{title}</h4>

        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{message}</p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm text-gray-700 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="bg-error-500 hover:bg-error-600 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm text-white"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
