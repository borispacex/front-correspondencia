import { Document } from '../../types/documents/document.type.ts';
import { RouterRoutes } from './RouterRoutes.tsx';
import { Modal } from '../../../ui/modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  document?: Document | null;
  isLoading?: boolean;
}

export default function RouterRoutesModal({ isOpen, onClose, document, isLoading = false }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" className="overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-6 dark:border-white/[0.05]">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recorrido del trámite</h2>
      </div>

      {/* Body */}
      <div className="max-h-[80vh] overflow-y-auto p-6">
        <RouterRoutes document={document} isLoading={isLoading} />
      </div>
    </Modal>
  );
}
