import {GroupIcon} from "../../../../../icons";
import {BasicMetrics} from "../../../../metrics/BasicMetrics.tsx";

export const DocPendientesMetrics = () => {
    return (
        <>
            <BasicMetrics
                icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
                name="Documentos pendientes"
                number="2"
            />
        </>
    )
}