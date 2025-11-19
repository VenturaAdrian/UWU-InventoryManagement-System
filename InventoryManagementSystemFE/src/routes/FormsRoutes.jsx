import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';

// render - forms element pages
const FormBasic = Loadable(lazy(() => import('views/forms/form-element/FormBasic')));

// ==============================|| FORMS ROUTING ||============================== //

const RoleAccess = () => {

  if (localStorage.getItem("user") === null) {
    return <Navigate to="/" replace />;
  } else {
    return <DashboardLayout />
  }
}

const FormsRoutes = {
  path: '/',
  element: <RoleAccess />,
  children: [

    {
      path: 'forms',
      children: [
        {
          path: 'form-elements',
          children: [{ path: 'basic', element: <FormBasic /> }]
        }
      ]
    }

  ]
};

export default FormsRoutes;
