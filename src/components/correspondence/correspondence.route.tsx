import { RouteObject } from 'react-router';
import { CorrespondenceLayout } from './layout/CorrespondenceLayout.tsx';
import { RouterPage } from './pages/RouterPage.tsx';
import { AprobarFirmarPage } from './pages/AprobarFirmarPage.tsx';
import { ROUTES } from '../../constants/routes.constants.ts';
import { DocumentPage } from './pages/DocumentPage.tsx';

export const correspondenceRoutes: RouteObject[] = [
  {
    element: <CorrespondenceLayout />,
    children: [
      { path: ROUTES.CORRESPONDENCE.ROUTE_SHEET, element: <RouterPage /> },
      { path: ROUTES.CORRESPONDENCE.DOCUMENTS, element: <DocumentPage /> },
      { path: ROUTES.CORRESPONDENCE.APPROVE_SIGN, element: <AprobarFirmarPage /> },
    ],
  },
];
