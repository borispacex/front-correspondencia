import { createBrowserRouter } from 'react-router';
import PrivateRoute from './components/common/PrivateRoute.tsx';
import AppLayout from './layout/AppLayout.tsx';
import Home from './pages/Dashboard/Home.tsx';
import RolesListPage from './pages/roles/RolesListPage.tsx';
import PermissionsListPage from './pages/permissions/PermissionsListPage.tsx';
import MenuItemsListPage from './pages/menu-items/MenuItemsListPage.tsx';
import UsersListPage from './pages/users/UsersListPage.tsx';
import UserProfiles from './pages/UserProfiles.tsx';
import Calendar from './pages/Calendar.tsx';
import Blank from './pages/Blank.tsx';
import FormElements from './pages/Forms/FormElements.tsx';
import BasicTables from './pages/Tables/BasicTables.tsx';
import Alerts from './pages/UiElements/Alerts.tsx';
import Avatars from './pages/UiElements/Avatars.tsx';
import Badges from './pages/UiElements/Badges.tsx';
import Buttons from './pages/UiElements/Buttons.tsx';
import Images from './pages/UiElements/Images.tsx';
import Videos from './pages/UiElements/Videos.tsx';
import LineChart from './pages/Charts/LineChart.tsx';
import BarChart from './pages/Charts/BarChart.tsx';
import SignIn from './pages/AuthPages/SignIn.tsx';
import SignUp from './pages/AuthPages/SignUp.tsx';
import NotFound from './pages/OtherPage/NotFound.tsx';
import { correspondenceRoutes } from './components/correspondence/correspondence.route.tsx';
import ResetPassword from './pages/AuthPages/ResetPassword.tsx';
import { ROUTES } from './constants/routes.constants.ts';
import MsalCallbackPage from './pages/auth/MsalCallbackPage.tsx';

export const appRouter = createBrowserRouter([
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Home /> },

          // Modules
          { path: ROUTES.ROLES.LIST, element: <RolesListPage /> },
          { path: ROUTES.PERMISSIONS.LIST, element: <PermissionsListPage /> },
          { path: ROUTES.MENU_ITEMS.LIST, element: <MenuItemsListPage /> },
          { path: ROUTES.USERS.LIST, element: <UsersListPage /> },
          { path: ROUTES.PROFILE, element: <UserProfiles /> },

          // Others
          { path: 'calendar', element: <Calendar /> },
          { path: 'blank', element: <Blank /> },

          // Forms
          { path: 'form-elements', element: <FormElements /> },

          // Tables
          { path: 'basic-tables', element: <BasicTables /> },

          // UI
          { path: 'alerts', element: <Alerts /> },
          { path: 'avatars', element: <Avatars /> },
          { path: 'badge', element: <Badges /> },
          { path: 'buttons', element: <Buttons /> },
          { path: 'images', element: <Images /> },
          { path: 'videos', element: <Videos /> },

          // Charts
          { path: 'line-chart', element: <LineChart /> },
          { path: 'bar-chart', element: <BarChart /> },

          ...correspondenceRoutes,
        ],
      },
    ],
  },

  // Auth
  { path: ROUTES.SIGN_IN, element: <SignIn /> },
  { path: ROUTES.SIGN_UP, element: <SignUp /> },
  { path: ROUTES.RESET_PASSWORD, element: <ResetPassword /> },
  { path: '/msal-callback', element: <MsalCallbackPage /> },

  // Fallback
  { path: '*', element: <NotFound /> },
]);
