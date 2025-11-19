import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - dashboard pages
const DefaultPages = Loadable(lazy(() => import('views/navigation/dashboard/Default')));

// ==============================|| NAVIGATION ROUTING ||============================== //

const RoleAccess = () => {

  if (localStorage.getItem("user") === null) {
    return <Navigate to="/" replace />;
  } else {
    return <DashboardLayout />
  }
}

const NavigationRoutes = {
  path: '/',
  element: <RoleAccess />,
  children: [

    {
      path: '/dashboard',
      element: <DefaultPages />
    }

  ]
};

export default NavigationRoutes;
