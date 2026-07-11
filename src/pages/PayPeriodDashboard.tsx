import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { payPeriodApi } from '@/api/client';
import type { PayPeriod } from '@/api/generated/models/PayPeriod';
import useSelectedClient from '@/state/client/useSelectedClient';

type FetchResult = {
  payPeriodId: string;
  payPeriod: PayPeriod | null;
  errorMessage: string | null;
};

const PayPeriodDashboard = () => {
  const { selectedClient, clientsLoading } = useSelectedClient();
  const { payPeriodId } = useParams<{ payPeriodId: string }>();
  const [fetchResult, setFetchResult] = useState<FetchResult | null>(null);

  const clientId = selectedClient?.clientId;

  useEffect(() => {
    if (!clientId || !payPeriodId) return;

    let cancelled = false;

    payPeriodApi
      .v1GetPayPeriodById({ clientId, payPeriodId })
      .then((payPeriod) => {
        if (cancelled) return;
        setFetchResult({ payPeriodId, payPeriod, errorMessage: null });
      })
      .catch((error) => {
        console.error('Failed to load pay period', error);
        if (cancelled) return;
        setFetchResult({ payPeriodId, payPeriod: null, errorMessage: 'Failed to load pay period.' });
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, payPeriodId]);

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

  if (fetchResult?.errorMessage) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">{fetchResult.errorMessage}</Typography>
      </Container>
    );
  }

  // Pay period fetch for the current id hasn't resolved yet.
  if (!fetchResult || fetchResult.payPeriodId !== payPeriodId) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return <Container sx={{ py: 4 }} id="pay-period-dashboard-cards" />;
};

export default PayPeriodDashboard;
