import { createBrowserRouter } from 'react-router-dom';

// project-imports
import PagesRoutes from './PagesRoutes';
import NavigationRoutes from './NavigationRoutes';
import ComponentsRoutes from './ComponentsRoutes';
import FormsRoutes from './FormsRoutes';
import TablesRoutes from './TablesRoutes';
import ChartMapRoutes from './ChartMapRoutes';
import OtherRoutes from './OtherRoutes';
import AuthRoutes from './AuthRoutes';
import LoginPage from '../views/auth/login/Login';
import ProductRoutes from './ProductRoutes';
// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
  [AuthRoutes,
    {
      path: '/',
      element: <LoginPage />
    },
    ProductRoutes,
    NavigationRoutes, ComponentsRoutes, FormsRoutes, TablesRoutes, ChartMapRoutes, PagesRoutes, OtherRoutes],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
