import { Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { clientApi } from '@/api/client';
import useFetchByKey from '@/hooks/useFetchByKey';
import useSelectedClient from '@/state/client/useSelectedClient';
import ClientInformationCard from '@/components/ClientSummary/ClientInformationCard/ClientInformationCard';
import ClientEmployeesCard from '@/components/ClientSummary/ClientEmployeesCard/ClientEmployeesCard';
import ClientSupervisorsCard from '@/components/ClientSummary/ClientSupervisorsCard/ClientSupervisorsCard';
import ClientActivitiesCard from '@/components/ClientSummary/ClientActivitiesCard/ClientActivitiesCard';
import ClientFundingSourcesCard from '@/components/ClientSummary/ClientFundingSourcesCard/ClientFundingSourcesCard';
import ClientHolidaysCard from '@/components/ClientSummary/ClientHolidaysCard/ClientHolidaysCard';
import ClientSettingsCard from '@/components/ClientSummary/ClientSettingsCard/ClientSettingsCard';
import ClientPayPeriodCard from '@/components/ClientSummary/ClientPayPeriodCard/ClientPayPeriodCard';
import ClientTimesheetFoldersCard from '@/components/ClientSummary/ClientTimesheetFoldersCard/ClientTimesheetFoldersCard';

const ClientSummary = () => {
  const { selectedClient, clientsLoading } = useSelectedClient();

  const clientId = selectedClient?.clientId;

  const {
    data: summary,
    errorMessage,
    loading,
  } = useFetchByKey(clientId, (clientId) => clientApi.v1GetClientSummary({ clientId }), 'Failed to load client summary.');

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

  if (errorMessage) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">{errorMessage}</Typography>
      </Container>
    );
  }

  // Summary fetch for the current client hasn't resolved yet.
  if (loading || !summary) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={2} id="client-summary-cards">
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ClientInformationCard clientName={selectedClient.clientName ?? ''} clientCode={selectedClient.clientCode ?? ''} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ClientEmployeesCard employees={summary.employees ?? []} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ClientSupervisorsCard supervisors={summary.supervisors ?? []} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ClientActivitiesCard activities={summary.activities ?? []} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ClientFundingSourcesCard fundingSources={summary.fundingSources ?? []} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ClientHolidaysCard holidays={summary.holidays ?? []} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ClientTimesheetFoldersCard timesheetFolders={summary.timesheetFolders ?? []} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ClientSettingsCard settings={summary.settings ?? {}} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ClientPayPeriodCard payPeriods={summary.payPeriods ?? []} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ClientSummary;
