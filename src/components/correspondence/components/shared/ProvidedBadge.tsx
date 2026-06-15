import Badge from '../../../ui/badge/Badge.tsx';
import { useProvided } from '../../hooks/catalog/useProvided.ts';

interface Props {
  providedIds?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function ProvidedBadge({ providedIds, size = 'sm' }: Props) {
  const { getNameById, getBadgeClassById } = useProvided();

  if (!providedIds) return null;

  const ids = providedIds
    .split(',')
    .map((id) => Number(id.trim()))
    .filter(Boolean);

  if (ids.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {ids.map((id) => (
        <Badge key={id} size={size} className={getBadgeClassById(id)}>
          {getNameById(id)}
        </Badge>
      ))}
    </div>
  );
}
