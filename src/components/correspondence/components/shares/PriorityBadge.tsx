import { BadgeIcon } from '../../../../icons';
import { usePriority } from '../../hooks/catalog/usePriority.ts';

export function PriorityBadge({ priorityId }: { priorityId?: number }) {
  const { getNameById, getBadgeClassById } = usePriority();

  const label = getNameById(priorityId);
  const cls = getBadgeClassById(priorityId);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${cls}`}
    >
      <BadgeIcon />
      {label}
    </span>
  );
}
