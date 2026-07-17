import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/AppLayout';
import Landing from '@/pages/Landing';
import ClientSummary from '@/pages/ClientSummary';
import EmployeesManagement from '@/pages/EmployeesManagement/EmployeesManagement';
import PayPeriodDashboard from '@/pages/PayPeriodDashboard';
import TimesheetFoldersManagement from '@/pages/TimesheetFoldersManagement/TimesheetFoldersManagement';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'client/:clientId', element: <ClientSummary /> },
      { path: 'client/:clientId/employees', element: <EmployeesManagement /> },
      { path: 'client/:clientId/timesheetFolders', element: <TimesheetFoldersManagement /> },
      { path: 'client/:clientId/payPeriod/:payPeriodId', element: <PayPeriodDashboard /> },
    ],
  },
]);

export default router;
