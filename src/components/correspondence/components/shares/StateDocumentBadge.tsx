import { useStateDocument } from '../../hooks/catalog/useStateDocument.ts';

export function StateDocumentBadge({ stateDocumentId }: { stateDocumentId?: number }) {
  const { getNameById, getBadgeClassById } = useStateDocument();

  const label = getNameById(stateDocumentId);
  const cls = getBadgeClassById(stateDocumentId);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold tracking-wide uppercase ${cls}`}
    >
      {label}
    </span>
  );
}
