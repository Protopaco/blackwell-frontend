import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { payPeriodApi } from '@/api/client';
import FundingSourcesCard from '@/components/PayPeriodDashboard/FundingSourcesCard/FundingSourcesCard';
import useFetchByKey from '@/hooks/useFetchByKey';

const FundingSourcesPage = () => {
  const { clientId, payPeriodId } = useParams<{ clientId: string; payPeriodId: string }>();
  const key = clientId && payPeriodId ? `${clientId}/${payPeriodId}` : undefined;

  const { data: payPeriodConfig, errorMessage, loading } = useFetchByKey(
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

  return <FundingSourcesCard fundingSources={payPeriodConfig.fundingSources ?? []} />;
};

export default FundingSourcesPage;
