import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - forms element pages
const FormBasic = Loadable(lazy(() => import('views/forms/form-element/FormBasic')));

// render - login pages
const LoginPage = Loadable(lazy(() => import('../views/auth/login/Login')));

// render - register pages
const RegisterPage = Loadable(lazy(() => import('../views/auth/register/Register')));

// ==============================|| FORMS ROUTING ||============================== //

const AuthRoutes = {
    path: '/',
    children: [
        // {
        //     index: true, // 👈 this means "when path = '/'"
        //     element: <Navigate to="/login" replace /> // redirect to login
        // },
        {
            path: '/',
            element: <LoginPage />
        }
        // {
        //     path: 'register',
        //     element: <RegisterPage />
        // }
    ]
};

export default AuthRoutes;
