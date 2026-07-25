import { Outlet, Navigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { payPeriodApi } from '@/api/client';
import useFetchByKey from '@/hooks/useFetchByKey';
import PayPeriodHeader from '@/pages/PayPeriod/PayPeriodLayout/PayPeriodHeader';
import PayPeriodTabs from '@/pages/PayPeriod/PayPeriodLayout/PayPeriodTabs';
import type { PayPeriod } from '@/api/generated/models/PayPeriod';
import useSelectedClient from '@/state/client/useSelectedClient';

export type PayPeriodLayoutContext = {
  payPeriod: PayPeriod;
  refetchPayPeriod: () => void;
};

const PayPeriodLayout = () => {
  const { selectedClient, clientsLoading } = useSelectedClient();
  const { payPeriodId } = useParams<{ payPeriodId: string }>();

  const clientId = selectedClient?.clientId;
  const key = clientId && payPeriodId ? `${clientId}/${payPeriodId}` : undefined;
  const basePath = clientId && payPeriodId ? `/client/${clientId}/payPeriod/${payPeriodId}` : '';

  const {
    data: payPeriod,
    errorMessage,
    loading,
    refetch: refetchPayPeriod,
  } = useFetchByKey(key, () => payPeriodApi.v1GetPayPeriodById({ clientId: clientId!, payPeriodId: payPeriodId! }), 'Failed to load pay period.');

  const {
    data: payPeriodConfig,
    refetch: refetchPayPeriodConfig,
  } = useFetchByKey(
    key,
    () => payPeriodApi.v1GetPayPeriodConfig({ clientId: clientId!, payPeriodId: payPeriodId! }),
    'Failed to load pay period configuration.'
  );

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

  return (
    <Container sx={{ py: 4 }} id="pay-period-layout">
      <Stack spacing={3}>
        <PayPeriodHeader
          clientId={clientId!}
          payPeriodId={payPeriodId!}
          payPeriod={payPeriod}
          holidays={payPeriodConfig?.holidays ?? []}
          onHolidaysChanged={refetchPayPeriodConfig}
        />
        <PayPeriodTabs basePath={basePath} payPeriodId={payPeriodId!} payPeriodStatus={payPeriod.status} />
        <Outlet context={{ payPeriod, refetchPayPeriod } satisfies PayPeriodLayoutContext} />
      </Stack>
    </Container>
  );
};

export default PayPeriodLayout;
