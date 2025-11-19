import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';

// render - bootstrap table pages
const BootstrapTableBasic = Loadable(lazy(() => import('views/table/bootstrap-table/BasicTable')));

// ==============================|| TABLES ROUTING ||============================== //

const RoleAccess = () => {
  if (localStorage.getItem("user") === null) {
    return <Navigate to="/" replace />;
  } else {
    return <DashboardLayout />
  }
}

const TablesRoutes = {
  path: '/',
  element: <RoleAccess />,
  children: [
    {
      path: 'tables/bootstrap-table',
      children: [
        {
          path: 'basic-table',
          element: <BootstrapTableBasic />
        }
      ]
    }
  ]
};

export default TablesRoutes;
