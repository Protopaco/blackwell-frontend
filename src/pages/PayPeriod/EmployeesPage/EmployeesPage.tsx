import { useOutletContext, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { payrollReportApi, timesheetApi } from '@/api/client';
import EmployeeTimesheetStatusCard from '@/components/PayPeriodDashboard/EmployeeTimesheetStatusCard/EmployeeTimesheetStatusCard';
import useAsyncAction from '@/hooks/useAsyncAction';
import useFetchByKey from '@/hooks/useFetchByKey';
import payrollReportGenerated from '@/models/payrollReportGenerated';
import type { PayPeriodLayoutContext } from '@/pages/PayPeriod/PayPeriodLayout/PayPeriodLayout';

const EmployeesPage = () => {
  const { clientId, payPeriodId } = useParams<{ clientId: string; payPeriodId: string }>();
  const { payPeriod, refetchPayPeriod } = useOutletContext<PayPeriodLayoutContext>();
  const key = clientId && payPeriodId ? `${clientId}/${payPeriodId}` : undefined;
  // Includes payPeriod.status so this re-fetches (or starts skipping) the moment the status that
  // gates payroll-report existence changes, without a separate manual refetch call.
  const payrollReportKey = key ? `${key}/${payPeriod.status}` : undefined;

  const {
    data: employees,
    errorMessage: employeesErrorMessage,
    loading: employeesLoading,
    refetch: refetchEmployees,
  } = useFetchByKey(
    key,
    () => timesheetApi.v1GetTimesheetStatus({ clientId: clientId!, payPeriodId: payPeriodId! }),
    'Failed to load employee timesheet status.'
  );

  const { data: payrollReport, refetch: refetchPayrollReport } = useFetchByKey(
    payrollReportKey,
    () => (payrollReportGenerated(payPeriod.status) ? payrollReportApi.v1GetPayrollReport({ clientId: clientId!, payPeriodId: payPeriodId! }) : Promise.resolve(null)),
    'Failed to load payroll report.'
  );

  const handleRefresh = () => {
    refetchPayPeriod();
    refetchEmployees();
    refetchPayrollReport();
  };

  const {
    run: generatePayrollReport,
    loading: generatingPayrollReport,
    errorMessage: payrollReportErrorMessage,
  } = useAsyncAction(async () => {
    await payrollReportApi.v1GeneratePayrollReport({ clientId: clientId!, payPeriodId: payPeriodId! });
    refetchPayPeriod();
  }, 'Failed to generate payroll report.', 'Payroll report generated.');

  const {
    run: generateTimesheets,
    loading: generatingTimesheets,
    errorMessage: timesheetsErrorMessage,
  } = useAsyncAction(async () => {
    await timesheetApi.v1GenerateTimesheets({ clientId: clientId!, payPeriodId: payPeriodId! });
    refetchPayPeriod();
    refetchEmployees();
  }, 'Failed to generate timesheets.', 'Timesheets generated.');

  if (employeesErrorMessage) {
    return <Typography color="error">{employeesErrorMessage}</Typography>;
  }

  if (employeesLoading || !employees) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button variant="outlined" onClick={handleRefresh}>
          Refresh
        </Button>
        <Button variant="outlined" onClick={generateTimesheets} disabled={generatingTimesheets} loading={generatingTimesheets}>
          Generate Timesheets
        </Button>
        <Button variant="contained" onClick={generatePayrollReport} disabled={generatingPayrollReport} loading={generatingPayrollReport}>
          Generate Payroll Report
        </Button>
      </Stack>
      {timesheetsErrorMessage && <Typography color="error">{timesheetsErrorMessage}</Typography>}
      {payrollReportErrorMessage && <Typography color="error">{payrollReportErrorMessage}</Typography>}
      <EmployeeTimesheetStatusCard
        clientId={clientId!}
        payPeriodId={payPeriodId!}
        employees={employees}
        payrollReport={payrollReport}
        onEmployeeRemoved={refetchEmployees}
      />
    </Stack>
  );
};

export default EmployeesPage;
