import {ReactNode} from "react";

interface Props {
    icon: ReactNode;
    name: string;
    number: string;
}
export const BasicMetrics = ({icon, name, number}: Props) => {

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    {/*<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />*/}
                    {icon}
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {name}
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {number}
                        </h4>
                    </div>
                </div>
            </div>
        </>
    )
}