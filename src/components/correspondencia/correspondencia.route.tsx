import {RouteObject} from "react-router";
import {CorrespondenciaLayout} from "./layout/CorrespondenciaLayout.tsx";
import {DocumentosCorrespondenciaPage} from "./pages/DocumentosCorrespondencia.tsx";
import {HojaRutaCorrespondenciaPage} from "./pages/HojaRutaCorrespondenciaPage.tsx";
import {AprobarFirmarCorrespondenciaPage} from "./pages/AprobarFirmarCorrespondencia.tsx";
import {ROUTES} from "../../constants/routes.constants.ts";


export const correspondenciaRoutes: RouteObject[] = [
    {
        element: <CorrespondenciaLayout />,
        children: [
            { path: ROUTES.CORRESPONDENCE.ROUTE_SHEET, element: <HojaRutaCorrespondenciaPage /> },
            { path: ROUTES.CORRESPONDENCE.DOCUMENTS, element: <DocumentosCorrespondenciaPage /> },
            { path: ROUTES.CORRESPONDENCE.APPROVE_SIGN, element: <AprobarFirmarCorrespondenciaPage /> },
        ],
    },
];