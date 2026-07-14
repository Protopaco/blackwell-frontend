import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/AppLayout';
import Landing from '@/pages/Landing';
import ClientSummary from '@/pages/ClientSummary';
import PayPeriodDashboard from '@/pages/PayPeriodDashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'client/:clientId', element: <ClientSummary /> },
      { path: 'client/:clientId/payPeriod/:payPeriodId', element: <PayPeriodDashboard /> },
    ],
  },
]);

export default router;
