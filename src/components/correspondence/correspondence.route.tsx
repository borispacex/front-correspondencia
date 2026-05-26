import {RouteObject} from "react-router";
import {CorrespondenceLayout} from "./layout/CorrespondenceLayout.tsx";
import {DocumentsPage} from "./pages/DocumentsPage.tsx";
import {RoadmapPage} from "./pages/RoadmapPage.tsx";
import {AprobarFirmarPage} from "./pages/AprobarFirmarPage.tsx";
import {ROUTES} from "../../constants/routes.constants.ts";


export const correspondenciaRoutes: RouteObject[] = [
    {
        element: <CorrespondenceLayout />,
        children: [
            { path: ROUTES.CORRESPONDENCE.ROUTE_SHEET, element: <RoadmapPage /> },
            { path: ROUTES.CORRESPONDENCE.DOCUMENTS, element: <DocumentsPage /> },
            { path: ROUTES.CORRESPONDENCE.APPROVE_SIGN, element: <AprobarFirmarPage /> },
        ],
    },
];