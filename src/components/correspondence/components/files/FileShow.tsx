import { Document } from '../../types/documents/document.type.ts';
import { FileInfo } from './FileInfo.tsx';
import { FileRoutes } from './FileRoutes.tsx';

interface DocumentShowProps {
  document?: Document | null;
  isLoadingDocument?: boolean;
  isLoadingHistory?: boolean;
  isSelected?: boolean;
}

export const FileShow = ({
  document,
  isLoadingDocument = false,
  isLoadingHistory = false,
  isSelected = false,
}: DocumentShowProps) => {
  return (
    <div className="flex flex-col gap-5 xl:flex-row">
      {/* LEFT */}
      <div className="w-full min-w-0 xl:flex-1">
        <FileInfo document={document} isLoading={isLoadingDocument} isSelected={isSelected} />
      </div>

      {/* RIGHT */}
      <div className="w-full min-w-0 xl:flex-1">
        <FileRoutes document={document} isLoading={isLoadingHistory} isSelected={isSelected} />
      </div>
    </div>
  );
};
