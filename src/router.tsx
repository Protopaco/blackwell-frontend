import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/AppLayout';
import ActivitiesManagement from '@/pages/ActivitiesManagement/ActivitiesManagement';
import Landing from '@/pages/Landing';
import ClientSummary from '@/pages/ClientSummary';
import EmployeesManagement from '@/pages/EmployeesManagement/EmployeesManagement';
import FundingSourcesManagement from '@/pages/FundingSourcesManagement/FundingSourcesManagement';
import HolidaysManagement from '@/pages/HolidaysManagement/HolidaysManagement';
import AllocationReportPage from '@/pages/PayPeriod/AllocationReportPage/AllocationReportPage';
import PayPeriodLayout from '@/pages/PayPeriod/PayPeriodLayout/PayPeriodLayout';
import PayrollReportPage from '@/pages/PayPeriod/PayrollReportPage/PayrollReportPage';
import TimesheetStatusPage from '@/pages/PayPeriod/TimesheetStatusPage/TimesheetStatusPage';
import TimesheetFoldersManagement from '@/pages/TimesheetFoldersManagement/TimesheetFoldersManagement';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'client/:clientId', element: <ClientSummary /> },
      { path: 'client/:clientId/activities', element: <ActivitiesManagement /> },
      { path: 'client/:clientId/employees', element: <EmployeesManagement /> },
      { path: 'client/:clientId/fundingSources', element: <FundingSourcesManagement /> },
      { path: 'client/:clientId/holidays', element: <HolidaysManagement /> },
      { path: 'client/:clientId/timesheetFolders', element: <TimesheetFoldersManagement /> },
      {
        path: 'client/:clientId/payPeriod/:payPeriodId',
        element: <PayPeriodLayout />,
        children: [
          { index: true, element: <TimesheetStatusPage /> },
          { path: 'payrollReport', element: <PayrollReportPage /> },
          { path: 'allocationReport', element: <AllocationReportPage /> },
        ],
      },
    ],
  },
]);

export default router;
