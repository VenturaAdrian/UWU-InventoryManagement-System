import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';

// render - basic component pages
const BasicButton = Loadable(lazy(() => import('views/components/basic/Button')));
const BasicBadges = Loadable(lazy(() => import('views/components/basic/Badges')));
const BasicBreadcrumb = Loadable(lazy(() => import('views/components/basic/Breadcrumb')));
const BasicCollapse = Loadable(lazy(() => import('views/components/basic/Collapse')));
const BasicTabsPills = Loadable(lazy(() => import('views/components/basic/TabsPills')));
const BasicTypography = Loadable(lazy(() => import('views/components/basic/Typography')));

// ==============================|| COMPONENT ROUTING ||============================== //

const RoleAccess = () => {

  if (localStorage.getItem("user") === null) {
    return <Navigate to="/" replace />;
  } else {
    return <DashboardLayout />
  }
}

const ComponentsRoutes = {
  path: '/',
  element: <RoleAccess />,
  children: [

    {
      path: 'basic',
      children: [
        {
          path: 'buttons',
          element: <BasicButton />
        },
        {
          path: 'badges',
          element: <BasicBadges />
        },
        {
          path: 'breadcrumb',
          element: <BasicBreadcrumb />
        },
        {
          path: 'collapse',
          element: <BasicCollapse />
        },
        {
          path: 'tabs-pills',
          element: <BasicTabsPills />
        },
        {
          path: 'typography',
          element: <BasicTypography />
        }
      ]
    }


  ]
};

export default ComponentsRoutes;
