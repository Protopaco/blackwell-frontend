import { useOutletContext, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { payPeriodApi } from '@/api/client';
import ActivitiesCard from '@/components/PayPeriodDashboard/ActivitiesCard/ActivitiesCard';
import useFetchByKey from '@/hooks/useFetchByKey';
import type { PayPeriodLayoutContext } from '@/pages/PayPeriod/PayPeriodLayout/PayPeriodLayout';

const ActivitiesPage = () => {
  const { clientId, payPeriodId } = useParams<{ clientId: string; payPeriodId: string }>();
  const { payPeriod } = useOutletContext<PayPeriodLayoutContext>();
  const key = clientId && payPeriodId ? `${clientId}/${payPeriodId}` : undefined;

  const {
    data: payPeriodConfig,
    errorMessage,
    loading,
    refetch: refetchPayPeriodConfig,
  } = useFetchByKey(
    key,
    () => payPeriodApi.v1GetPayPeriodConfig({ clientId: clientId!, payPeriodId: payPeriodId! }),
    'Failed to load pay period configuration.'
  );

  if (errorMessage) {
    return <Typography color="error">{errorMessage}</Typography>;
  }

  if (loading || !payPeriodConfig) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ActivitiesCard
      clientId={clientId!}
      payPeriodId={payPeriodId!}
      activities={payPeriodConfig.activities ?? []}
      fundingSources={payPeriodConfig.fundingSources ?? []}
      payPeriodStatus={payPeriod.status}
      onActivitiesChanged={refetchPayPeriodConfig}
    />
  );
};

export default ActivitiesPage;
