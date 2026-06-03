import { RouteObject } from 'react-router';
import { CorrespondenceLayout } from './layout/CorrespondenceLayout.tsx';
import RouterPage from './pages/Router/RouterPage.tsx';
import { ROUTES } from '../../constants/routes.constants.ts';
import DocumentPage from './pages/DocumentPage.tsx';
import SignDocumentPage from './pages/SignDocumentPage.tsx';
import RouterShowPage from './pages/Router/show/RouterShowPage.tsx';

export const correspondenceRoutes: RouteObject[] = [
  {
    element: <CorrespondenceLayout />,
    children: [
      { path: ROUTES.CORRESPONDENCE.ROUTE_SHEET.ALL, element: <RouterPage /> },
      { path: ROUTES.CORRESPONDENCE.ROUTE_SHEET.SHOW, element: <RouterShowPage /> },
      { path: ROUTES.CORRESPONDENCE.DOCUMENTS, element: <DocumentPage /> },
      { path: ROUTES.CORRESPONDENCE.SIGN_DOCUMENT, element: <SignDocumentPage /> },
    ],
  },
];
