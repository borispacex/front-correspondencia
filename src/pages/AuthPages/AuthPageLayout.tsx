import React from 'react';
import GridShape from '../../components/common/GridShape';
import { Link } from 'react-router';
import ThemeTogglerTwo from '../../components/common/ThemeTogglerTwo';
import { ROUTES } from '../../constants/routes.constants.ts';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
      <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
        {children}
        <div className="bg-brand-950 hidden h-full w-full items-center lg:grid lg:w-1/2 dark:bg-white/5">
          <div className="relative z-1 flex items-center justify-center">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex max-w-xs flex-col items-center">
              <Link to={ROUTES.HOME} className="mb-4 block">
                <img width={220} height={220} src="/images/logo_emi/emi_logo.png" alt="Logo EMI" />
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">Escuela Militar de Ingeniería</p>
            </div>
          </div>
        </div>
        <div className="fixed right-6 bottom-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
