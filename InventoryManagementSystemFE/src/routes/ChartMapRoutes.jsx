import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';

// render - chart pages
const ApexChart = Loadable(lazy(() => import('views/charts/ApexChart')));

// render - map pages
const GoogleMaps = Loadable(lazy(() => import('views/maps/GoogleMap')));

// ==============================|| CHART & MAP ROUTING ||============================== //


const RoleAccess = () => {

  if (localStorage.getItem("user") === null) {
    return <Navigate to="/" replace />;
  } else {
    return <DashboardLayout />
  }
}

const ChartMapRoutes = {
  path: '/',
  element: <RoleAccess />,
  children: [
    {
      path: 'charts',
      children: [
        {
          path: 'apex-chart',
          element: <ApexChart />
        }
      ]
    },
    {
      path: 'map',
      children: [
        {
          path: 'google-map',
          element: <GoogleMaps />
        }
      ]
    }


  ]
};

export default ChartMapRoutes;
