import { RouteObject } from 'react-router';
import { CorrespondenceLayout } from './layout/CorrespondenceLayout.tsx';
import RouterPage from './pages/Router/RouterPage.tsx';
import RouterPendingPage from './pages/Router/RouterPendingPage.tsx';
import RouterAttendedPage from './pages/Router/RouterAttendedPage.tsx';
import RouterArchivedPage from './pages/Router/RouterArchivedPage.tsx';
import RouterShowPage from './pages/Router/show/RouterShowPage.tsx';
import RouterPendingShowPage from './pages/Router/show/RouterPendingShowPage.tsx';
import RouterAttendedShowPage from './pages/Router/show/RouterAttendedShowPage.tsx';
import RouterArchivedShowPage from './pages/Router/show/RouterArchivedShowPage.tsx';
import { ROUTES } from '../../constants/routes.constants.ts';
import FilePage from './pages/files/FilePage.tsx';
import SignFilePage from './pages/sign-files/SignFilePage.tsx';

export const correspondenceRoutes: RouteObject[] = [
  {
    element: <CorrespondenceLayout />,
    children: [
      // ── Trámites (todos) ─────────────────────────────────────
      { path: ROUTES.CORRESPONDENCE.ROUTE_SHEET.ALL, element: <RouterPage /> },
      { path: ROUTES.CORRESPONDENCE.ROUTE_SHEET.SHOW, element: <RouterShowPage /> },

      // ── Bandeja de Entrada (pendientes) ──────────────────────
      { path: ROUTES.CORRESPONDENCE.ROUTE_SHEET.PENDING, element: <RouterPendingPage /> },
      { path: ROUTES.CORRESPONDENCE.ROUTE_SHEET.PENDING_SHOW, element: <RouterPendingShowPage /> },

      // ── Bandeja de Salida (atendidos) ────────────────────────
      { path: ROUTES.CORRESPONDENCE.ROUTE_SHEET.ATTENDED, element: <RouterAttendedPage /> },
      { path: ROUTES.CORRESPONDENCE.ROUTE_SHEET.ATTENDED_SHOW, element: <RouterAttendedShowPage /> },

      // ── Archivados ───────────────────────────────────────────
      { path: ROUTES.CORRESPONDENCE.ROUTE_SHEET.ARCHIVED, element: <RouterArchivedPage /> },
      { path: ROUTES.CORRESPONDENCE.ROUTE_SHEET.ARCHIVED_SHOW, element: <RouterArchivedShowPage /> },

      // ── Otros ────────────────────────────────────────────────
      { path: ROUTES.CORRESPONDENCE.FILE, element: <FilePage /> },
      { path: ROUTES.CORRESPONDENCE.SIGN_FILE, element: <SignFilePage /> },
    ],
  },
];
