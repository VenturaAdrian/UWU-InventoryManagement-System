import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - other pages
const OtherSamplePage = Loadable(lazy(() => import('views/SamplePage')));

// ==============================|| OTHER ROUTING ||============================== //

const RoleAccess = () => {

  if (localStorage.getItem("user") === null) {
    return <Navigate to="/" replace />;
  } else {
    return <DashboardLayout />
  }
}

const OtherRoutes = {
  path: '/',
  element: <RoleAccess />,
  children: [

    {
      path: 'other',
      children: [
        {
          path: 'sample-page',
          element: <OtherSamplePage />
        }
      ]

    }
  ]
};

export default OtherRoutes;
