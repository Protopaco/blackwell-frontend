import { Navigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { payPeriodApi, timesheetApi } from '@/api/client';
import useFetchByKey from '@/hooks/useFetchByKey';
import useSelectedClient from '@/state/client/useSelectedClient';
import PayPeriodInfoCard from '@/components/PayPeriodDashboard/PayPeriodInfoCard/PayPeriodInfoCard';
import EmployeeTimesheetStatusCard from '@/components/PayPeriodDashboard/EmployeeTimesheetStatusCard/EmployeeTimesheetStatusCard';

const PayPeriodDashboard = () => {
  const { selectedClient, clientsLoading } = useSelectedClient();
  const { payPeriodId } = useParams<{ payPeriodId: string }>();

  const clientId = selectedClient?.clientId;
  const key = clientId && payPeriodId ? `${clientId}/${payPeriodId}` : undefined;

  const {
    data: payPeriod,
    errorMessage: payPeriodErrorMessage,
    loading: payPeriodLoading,
  } = useFetchByKey(key, () => payPeriodApi.v1GetPayPeriodById({ clientId: clientId!, payPeriodId: payPeriodId! }), 'Failed to load pay period.');

  const {
    data: employees,
    errorMessage: employeesErrorMessage,
    loading: employeesLoading,
  } = useFetchByKey(
    key,
    () => timesheetApi.v1GetTimesheetStatus({ clientId: clientId!, payPeriodId: payPeriodId! }),
    'Failed to load employee timesheet status.'
  );

  // Client list still loading — can't resolve the URL's clientId yet.
  if (clientsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Client list loaded but the URL's clientId matches no known client.
  if (!selectedClient) {
    return <Navigate to="/" replace />;
  }

  const errorMessage = payPeriodErrorMessage ?? employeesErrorMessage;
  if (errorMessage) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">{errorMessage}</Typography>
      </Container>
    );
  }

  // Either fetch for the current id hasn't resolved yet.
  if (payPeriodLoading || employeesLoading || !payPeriod || !employees) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }} id="pay-period-dashboard-cards">
      <PayPeriodInfoCard payPeriod={payPeriod} />
      <EmployeeTimesheetStatusCard employees={employees} />
    </Container>
  );
};

export default PayPeriodDashboard;
