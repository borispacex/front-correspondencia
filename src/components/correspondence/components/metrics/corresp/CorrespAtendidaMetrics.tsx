import { GroupIcon } from '../../../../../icons';
import { BasicMetrics } from '../../../../metrics/BasicMetrics.tsx';

export const CorrespAtendidaMetrics = () => {
  return (
    <>
      <BasicMetrics
        icon={<GroupIcon className="size-6 text-gray-800 dark:text-white/90" />}
        name="Correspondencia atendida"
        number="4"
      />
    </>
  );
};
