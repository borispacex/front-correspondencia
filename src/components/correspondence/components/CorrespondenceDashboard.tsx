import UserMetrics from "./metrics/admin/UserMetrics.tsx";
import {DocPendientesMetrics} from "./metrics/corresp/DocPendientesMetrics.tsx";
import {CorrespPendienteMetrics} from "./metrics/corresp/CorrespPendienteMetrics.tsx";
import {CorrespAtendidaMetrics} from "./metrics/corresp/CorrespAtendidaMetrics.tsx";
import {CorrespGeneradaMetrics} from "./metrics/corresp/CorrespGeneradaMetrics.tsx";

export const CorrespondenceDashboard = () => {
    return (
        <>
            <div className="col-span-6 space-y-6 xl:col-span-7">
                {/* Admin */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
                    <UserMetrics />
                </div>

                {/* Funcionario Público */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
                    <DocPendientesMetrics />
                    <CorrespPendienteMetrics />
                    <CorrespAtendidaMetrics />
                </div>

                {/* Grande */}
                <div className="w-full">
                    <CorrespGeneradaMetrics />
                </div>
            </div>
        </>
    )
}