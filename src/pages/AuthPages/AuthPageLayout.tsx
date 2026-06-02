import React from 'react';
import GridShape from '../../components/common/GridShape';
import { Link } from 'react-router';
import ThemeTogglerTwo from '../../components/common/ThemeTogglerTwo';
import { ROUTES } from '../../constants/routes.constants.ts';
import { MailIcon } from '../../icons';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Layout principal */}
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        {/* ── Panel izquierdo: formulario ── */}
        <div className="flex w-full flex-col items-center justify-center px-6 py-12 sm:px-10 lg:w-1/2 lg:px-16 xl:px-24">
          {/* Logo visible solo en mobile/tablet */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <Link to={ROUTES.SIGN_IN} className="mb-3 block transition-transform duration-200 hover:scale-105">
              <img
                width={90}
                height={90}
                src="/images/logo_emi/emi_logo.png"
                alt="Logo EMI"
                className="drop-shadow-md"
              />
            </Link>
            <span className="text-xs font-semibold tracking-widest text-blue-900 uppercase dark:text-blue-200">
              Escuela Militar de Ingeniería
            </span>
          </div>

          {/* Contenido del formulario (children) */}
          <div className="w-full max-w-md">{children}</div>
        </div>

        {/* ── Panel derecho: marca ── */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
          {/* Fondo decorativo: patrón de puntos */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Acento diagonal inferior */}
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />

          {/* GridShape decorativo */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
            <GridShape />
          </div>

          {/* Contenido central */}
          <div className="relative z-10 flex flex-col items-center gap-6 px-10 text-center">
            {/* Logo */}
            <Link to={ROUTES.SIGN_IN} className="group mb-2 block transition-transform duration-300 hover:scale-105">
              <div className="relative">
                {/* Halo dorado detrás del logo */}
                <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl transition-all duration-300 group-hover:bg-yellow-400/30" />
                <img
                  width={160}
                  height={160}
                  src="/images/logo_emi/emi_logo.png"
                  alt="Logo EMI"
                  className="relative drop-shadow-2xl"
                />
              </div>
            </Link>

            {/* Nombre de la institución */}
            <p className="text-sm font-medium tracking-[0.18em] text-blue-200/80 uppercase dark:text-white/50">
              Escuela Militar de Ingeniería
            </p>

            {/* Divider decorativo */}
            <div className="flex w-full items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />
              <div className="h-1.5 w-1.5 rotate-45 bg-yellow-400" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />
            </div>

            {/* Badge "Sistema de Correspondencia" */}
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
              {/* Línea izquierda */}
              <div className="h-[2px] w-8 shrink-0 rounded-full bg-yellow-400/70" />

              <div className="flex items-center gap-2">
                <span className="text-[clamp(0.65rem,0.9vw,1rem)] font-extrabold tracking-[0.1em] whitespace-nowrap text-white uppercase">
                  Sistema de
                </span>

                {/* Ícono de correo */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-yellow-400/60 bg-yellow-400/20 shadow-inner">
                  <MailIcon className="h-4 w-4 text-yellow-300" />
                </div>

                <span className="text-[clamp(0.65rem,0.9vw,1rem)] font-extrabold tracking-[0.1em] whitespace-nowrap text-white uppercase">
                  Correspondencia
                </span>
              </div>

              {/* Línea derecha */}
              <div className="h-[2px] w-8 shrink-0 rounded-full bg-yellow-400/70" />
            </div>

            {/* Tagline */}
            <p className="max-w-[22rem] text-xs leading-relaxed text-blue-200/60 dark:text-white/40">
              Plataforma oficial de gestión documental y correspondencia institucional.
            </p>
          </div>
        </div>
      </div>

      {/* ── Theme toggler fijo ── */}
      <div className="fixed right-5 bottom-5 z-50">
        <div className="rounded-full shadow-lg ring-1 ring-black/10 dark:ring-white/10">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
