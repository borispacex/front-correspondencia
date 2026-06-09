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
import AllDocumentPage from './pages/documents/AllDocumentPage.tsx';
import MyDocumentPage from './pages/documents/MyDocumentPage.tsx';
import MyDocumentShowPage from './pages/documents/MyDocumentShowPage.tsx';
import InboxPage from './pages/mailbox/InboxPage.tsx';
import InboxShowPage from './pages/mailbox/InboxShowPage.tsx';
import OutboxPage from './pages/mailbox/OutboxPage.tsx';
import OutboxShowPage from './pages/mailbox/OutboxShowPage.tsx';
import PendingPage from './pages/correspondence/PendingPage.tsx';
import PendingShowPage from './pages/correspondence/PendingShowPage.tsx';
import ArchivedPage from './pages/correspondence/ArchivedPage.tsx';
import ArchivedShowPage from './pages/correspondence/ArchivedShowPage.tsx';
import AllDocumentShowPage from './pages/documents/AllDocumentShowPage.tsx';

export const correspondenceRoutes: RouteObject[] = [
  {
    element: <CorrespondenceLayout />,
    children: [
      // ── Trámites (todos) ─────────────────────────────────────
      { path: ROUTES.CORRESPONDENCESS.ROUTE_SHEET.ALL, element: <RouterPage /> },
      { path: ROUTES.CORRESPONDENCESS.ROUTE_SHEET.SHOW, element: <RouterShowPage /> },

      // ── Bandeja de Entrada (pendientes) ──────────────────────
      { path: ROUTES.CORRESPONDENCESS.ROUTE_SHEET.PENDING, element: <RouterPendingPage /> },
      { path: ROUTES.CORRESPONDENCESS.ROUTE_SHEET.PENDING_SHOW, element: <RouterPendingShowPage /> },

      // ── Bandeja de Salida (atendidos) ────────────────────────
      { path: ROUTES.CORRESPONDENCESS.ROUTE_SHEET.ATTENDED, element: <RouterAttendedPage /> },
      { path: ROUTES.CORRESPONDENCESS.ROUTE_SHEET.ATTENDED_SHOW, element: <RouterAttendedShowPage /> },

      // ── Archivados ───────────────────────────────────────────
      { path: ROUTES.CORRESPONDENCESS.ROUTE_SHEET.ARCHIVED, element: <RouterArchivedPage /> },
      { path: ROUTES.CORRESPONDENCESS.ROUTE_SHEET.ARCHIVED_SHOW, element: <RouterArchivedShowPage /> },

      // ── Trámites ─────────────────────────────────────
      { path: ROUTES.DOCUMENTS.MY_DOCUMENTS.ALL, element: <MyDocumentPage /> },
      { path: ROUTES.DOCUMENTS.MY_DOCUMENTS.SHOW, element: <MyDocumentShowPage /> },
      { path: ROUTES.DOCUMENTS.ALL_DOCUMENTS.ALL, element: <AllDocumentPage /> },
      { path: ROUTES.DOCUMENTS.ALL_DOCUMENTS.SHOW, element: <AllDocumentShowPage /> },

      // ── Buzón ─────────────────────────────────────
      { path: ROUTES.MAILBOX.INBOX.ALL, element: <InboxPage /> },
      { path: ROUTES.MAILBOX.INBOX.SHOW, element: <InboxShowPage /> },
      { path: ROUTES.MAILBOX.OUTBOX.ALL, element: <OutboxPage /> },
      { path: ROUTES.MAILBOX.OUTBOX.SHOW, element: <OutboxShowPage /> },

      // ── Correspondencia ─────────────────────────────────────
      { path: ROUTES.CORRESPONDENCE.PENDING.ALL, element: <PendingPage /> },
      { path: ROUTES.CORRESPONDENCE.PENDING.SHOW, element: <PendingShowPage /> },
      { path: ROUTES.CORRESPONDENCE.ARCHIVED.ALL, element: <ArchivedPage /> },
      { path: ROUTES.CORRESPONDENCE.ARCHIVED.SHOW, element: <ArchivedShowPage /> },

      // ── Otros ────────────────────────────────────────────────
      { path: ROUTES.FILE, element: <FilePage /> },
      { path: ROUTES.SIGN_FILE, element: <SignFilePage /> },
    ],
  },
];
