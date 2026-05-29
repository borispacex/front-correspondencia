import { RouteObject } from 'react-router';
import { CorrespondenceLayout } from './layout/CorrespondenceLayout.tsx';
import RouterPage from './pages/RouterPage.tsx';
import { ROUTES } from '../../constants/routes.constants.ts';
import { DocumentPage } from './pages/DocumentPage.tsx';
import SignDocumentPage from './pages/SignDocumentPage.tsx';

export const correspondenceRoutes: RouteObject[] = [
  {
    element: <CorrespondenceLayout />,
    children: [
      { path: ROUTES.CORRESPONDENCE.ROUTE_SHEET, element: <RouterPage /> },
      { path: ROUTES.CORRESPONDENCE.DOCUMENTS, element: <DocumentPage /> },
      { path: ROUTES.CORRESPONDENCE.SIGN_DOCUMENT, element: <SignDocumentPage /> },
    ],
  },
];
