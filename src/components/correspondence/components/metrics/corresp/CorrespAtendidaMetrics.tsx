import {GroupIcon} from "../../../../../icons";
import {BasicMetrics} from "../../../../metrics/BasicMetrics.tsx";

export const CorrespAtendidaMetrics = () => {
    return (
        <>
            <BasicMetrics
                icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
                name="Correspondencia atendida"
                number="4"
            />
        </>
    )
}