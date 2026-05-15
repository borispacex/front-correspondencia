import {RouteObject} from "react-router";
import {CorrespondenciaLayout} from "./layout/CorrespondenciaLayout.tsx";
import {DocumentosCorrespondenciaPage} from "./pages/DocumentosCorrespondencia.tsx";
import {HojaRutaCorrespondenciaPage} from "./pages/HojaRutaCorrespondenciaPage.tsx";
import {AprobarFirmarCorrespondenciaPage} from "./pages/AprobarFirmarCorrespondencia.tsx";


export const correspondenciaRoutes: RouteObject[] = [
    {
        path: "correspondencia",
        element: <CorrespondenciaLayout />,
        children: [
            { path: "hoja-ruta", element: <HojaRutaCorrespondenciaPage /> },
            { path: "documentos", element: <DocumentosCorrespondenciaPage /> },
            { path: "aprobar-firmar", element: <AprobarFirmarCorrespondenciaPage /> },
        ],
    },
];