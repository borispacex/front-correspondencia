import { GroupIcon } from '../../../../../icons';
import { BasicMetrics } from '../../../../metrics/BasicMetrics.tsx';

export default function UserMetrics() {
  return (
    <>
      <BasicMetrics
        icon={<GroupIcon className="size-6 text-gray-800 dark:text-white/90" />}
        name="Usuarios activos"
        number="190"
      />
    </>
  );
}
