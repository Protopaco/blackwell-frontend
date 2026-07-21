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
import type { PayPeriodLayoutContext } from '@/pages/PayPeriod/PayPeriodLayout/PayPeriodLayout';

const TimesheetStatusPage = () => {
  const { clientId, payPeriodId } = useParams<{ clientId: string; payPeriodId: string }>();
  const { refetchPayPeriod } = useOutletContext<PayPeriodLayoutContext>();
  const key = clientId && payPeriodId ? `${clientId}/${payPeriodId}` : undefined;

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

  const {
    run: generatePayrollReport,
    loading: generatingPayrollReport,
    errorMessage: payrollReportErrorMessage,
  } = useAsyncAction(async () => {
    await payrollReportApi.v1GeneratePayrollReport({ clientId: clientId!, payPeriodId: payPeriodId! });
    refetchPayPeriod();
  }, 'Failed to generate payroll report.');

  const {
    run: generateTimesheets,
    loading: generatingTimesheets,
    errorMessage: timesheetsErrorMessage,
  } = useAsyncAction(async () => {
    await timesheetApi.v1GenerateTimesheets({ clientId: clientId!, payPeriodId: payPeriodId! });
    refetchPayPeriod();
    refetchEmployees();
  }, 'Failed to generate timesheets.');

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
        <Button variant="outlined" onClick={generateTimesheets} disabled={generatingTimesheets} loading={generatingTimesheets}>
          Generate Timesheets
        </Button>
        <Button variant="contained" onClick={generatePayrollReport} disabled={generatingPayrollReport} loading={generatingPayrollReport}>
          Generate Payroll Report
        </Button>
      </Stack>
      {timesheetsErrorMessage && <Typography color="error">{timesheetsErrorMessage}</Typography>}
      {payrollReportErrorMessage && <Typography color="error">{payrollReportErrorMessage}</Typography>}
      <EmployeeTimesheetStatusCard employees={employees} />
    </Stack>
  );
};

export default TimesheetStatusPage;
