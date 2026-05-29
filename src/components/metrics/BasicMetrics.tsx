import { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  name: string;
  number: string;
}
export const BasicMetrics = ({ icon, name, number }: Props) => {
  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          {/*<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />*/}
          {icon}
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{name}</span>
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">{number}</h4>
          </div>
        </div>
      </div>
    </>
  );
};
