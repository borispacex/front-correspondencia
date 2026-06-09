import { HomeCorrespondence } from '../../components/correspondence/components/home/HomeCorrespondence.tsx';
import { useAuth } from '../../hooks/auth/useAuth.ts';
import PageMeta from '../../components/common/PageMeta.tsx';
import { APP_NAME } from '../../components/correspondence/constants/correspondence.constants.ts';

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <PageMeta title={`Inicio | ${APP_NAME}`} description="Pagina de inicio" />
      {/*<PageBreadCrumb pageTitle="Dashboard" />*/}

      <div className="mb-5 rounded-2xl border border-gray-200 bg-white py-1 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="text-theme-xl text-gray-800 sm:text-2xl dark:text-white/90">
            {`Hola, `}
            <span className="font-semibold">{` ${user?.name} ${user?.last_name} ${user?.mother_last_name}`}</span>
          </h3>
          <p className="text-sm text-gray-500 sm:text-base dark:text-gray-400">
            Bienvenido al Sistema de Correspondencia
          </p>
        </div>
      </div>
      <HomeCorrespondence />
    </>
  );
}
