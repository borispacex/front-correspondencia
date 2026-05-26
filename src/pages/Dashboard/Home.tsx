import { CorrespondenceDashboard } from "../../components/correspondence/components/CorrespondenceDashboard.tsx";
import { useAuth } from "../../hooks/auth/useAuth.ts";

export default function Home() {
    const { user } = useAuth();

    return (
        <>
            <div className="mb-5 rounded-2xl border border-gray-200 bg-white py-1 dark:border-gray-800 dark:bg-white/[0.03] ">
                <div className="mx-auto w-full max-w-[630px] text-center">
                    <h3 className="text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                        {`Hola, `}
                        <span className="font-semibold">
                            {` ${user?.name} ${user?.last_name} ${user?.mother_last_name}`}
                        </span>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                        Bienvenido al Sistema de Correspondencia
                    </p>
                </div>
            </div>
            <CorrespondenceDashboard />
        </>
    );
}