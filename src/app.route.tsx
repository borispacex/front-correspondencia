import { createBrowserRouter } from "react-router";
import PrivateRoute from "./components/common/PrivateRoute.tsx";
import AppLayout from "./layout/AppLayout.tsx";
import Home from "./pages/Dashboard/Home.tsx";
import RolesListPage from "./pages/roles/RolesListPage.tsx";
import PermissionsListPage from "./pages/permissions/PermissionsListPage.tsx";
import MenuItemsListPage from "./pages/menu-items/MenuItemsListPage.tsx";
import UsersListPage from "./pages/users/UsersListPage.tsx";
import UserProfiles from "./pages/UserProfiles.tsx";
import Calendar from "./pages/Calendar.tsx";
import Blank from "./pages/Blank.tsx";
import FormElements from "./pages/Forms/FormElements.tsx";
import BasicTables from "./pages/Tables/BasicTables.tsx";
import Alerts from "./pages/UiElements/Alerts.tsx";
import Avatars from "./pages/UiElements/Avatars.tsx";
import Badges from "./pages/UiElements/Badges.tsx";
import Buttons from "./pages/UiElements/Buttons.tsx";
import Images from "./pages/UiElements/Images.tsx";
import Videos from "./pages/UiElements/Videos.tsx";
import LineChart from "./pages/Charts/LineChart.tsx";
import BarChart from "./pages/Charts/BarChart.tsx";
import SignIn from "./pages/AuthPages/SignIn.tsx";
import SignUp from "./pages/AuthPages/SignUp.tsx";
import NotFound from "./pages/OtherPage/NotFound.tsx";
import {correspondenciaRoutes} from "./components/correspondencia/correspondencia.route.tsx";
import ResetPassword from "./pages/AuthPages/ResetPassword.tsx";


export const appRouter = createBrowserRouter([
    {
        element: <PrivateRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    { index: true, element: <Home /> },

                    // Modules
                    { path: "/admin/roles", element: <RolesListPage /> },
                    { path: "/admin/permisos", element: <PermissionsListPage /> },
                    { path: "/admin/menu", element: <MenuItemsListPage /> },
                    { path: "/admin/usuarios", element: <UsersListPage /> },

                    // Others
                    { path: "perfil", element: <UserProfiles /> },
                    { path: "calendar", element: <Calendar /> },
                    { path: "blank", element: <Blank /> },

                    // Forms
                    { path: "form-elements", element: <FormElements /> },

                    // Tables
                    { path: "basic-tables", element: <BasicTables /> },

                    // UI
                    { path: "alerts", element: <Alerts /> },
                    { path: "avatars", element: <Avatars /> },
                    { path: "badge", element: <Badges /> },
                    { path: "buttons", element: <Buttons /> },
                    { path: "images", element: <Images /> },
                    { path: "videos", element: <Videos /> },

                    // Charts
                    { path: "line-chart", element: <LineChart /> },
                    { path: "bar-chart", element: <BarChart /> },

                    ...correspondenciaRoutes
                ],
            },

        ],
    },

    // Auth
    { path: "/iniciar-sesion", element: <SignIn /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/restablecer", element: <ResetPassword /> },


    // Fallback
    { path: "*", element: <NotFound /> },
]);