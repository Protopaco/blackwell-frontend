import { Outlet, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { payPeriodApi } from '@/api/client';
import PayPeriodInfoCard from '@/components/PayPeriodDashboard/PayPeriodInfoCard/PayPeriodInfoCard';
import NavButton from '@/components/Shared/NavButton/NavButton';
import useFetchByKey from '@/hooks/useFetchByKey';
import allocationReportGenerated from '@/models/allocationReportGenerated';
import NavIcon from '@/models/NavIcon';
import payrollReportGenerated from '@/models/payrollReportGenerated';
import type { PayPeriod } from '@/api/generated/models/PayPeriod';
import useSelectedClient from '@/state/client/useSelectedClient';

export type PayPeriodLayoutContext = {
  payPeriod: PayPeriod;
  refetchPayPeriod: () => void;
};

const PayPeriodLayout = () => {
  const { selectedClient, clientsLoading } = useSelectedClient();
  const { payPeriodId } = useParams<{ payPeriodId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const clientId = selectedClient?.clientId;
  const key = clientId && payPeriodId ? `${clientId}/${payPeriodId}` : undefined;
  const basePath = clientId && payPeriodId ? `/client/${clientId}/payPeriod/${payPeriodId}` : '';

  const {
    data: payPeriod,
    errorMessage,
    loading,
    refetch: refetchPayPeriod,
  } = useFetchByKey(key, () => payPeriodApi.v1GetPayPeriodById({ clientId: clientId!, payPeriodId: payPeriodId! }), 'Failed to load pay period.');

  if (clientsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedClient) {
    return <Navigate to="/" replace />;
  }

  if (errorMessage) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">{errorMessage}</Typography>
      </Container>
    );
  }

  if (loading || !payPeriod) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const tabValue = location.pathname.endsWith('/allocationReport')
    ? 'allocationReport'
    : location.pathname.endsWith('/payrollReport')
      ? 'payrollReport'
      : 'timesheetStatus';

  return (
    <Container sx={{ py: 4 }} id="pay-period-layout">
      <Stack spacing={3}>
        <Box>
          <NavButton label="Client Summary" path={`/client/${selectedClient.clientId}`} navIcon={NavIcon.Back} />
        </Box>
        <PayPeriodInfoCard payPeriod={payPeriod} />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={(_, nextValue: string) => {
              navigate(nextValue === 'timesheetStatus' ? basePath : `${basePath}/${nextValue}`);
            }}
          >
            <Tab label="Employees" value="timesheetStatus" />
            <Tab label="Payroll Report" value="payrollReport" disabled={!payrollReportGenerated(payPeriod.status)} />
            <Tab label="Allocation Report" value="allocationReport" disabled={!allocationReportGenerated(payPeriod.status)} />
          </Tabs>
        </Box>
        <Outlet context={{ payPeriod, refetchPayPeriod } satisfies PayPeriodLayoutContext} />
      </Stack>
    </Container>
  );
};

export default PayPeriodLayout;
