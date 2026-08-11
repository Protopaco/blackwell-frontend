import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import ClientSettingsFields from '@/components/ClientManagement/ClientSettingsFields/ClientSettingsFields';
import ClientManagementPage from '@/components/Shared/ClientManagementPage/ClientManagementPage';
import useSelectedClient from '@/state/client/useSelectedClient';
import useClientSettingsForm from './useClientSettingsForm/useClientSettingsForm';

const ClientSettingsManagement = () => {
  const { selectedClient } = useSelectedClient();
  const form = useClientSettingsForm(selectedClient?.clientId);
  const navigate = useNavigate();

  return (
    <ClientManagementPage title="Settings">
      <Paper sx={{ p: 3 }}>
        {form.loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : form.loadErrorMessage ? (
          <Typography color="error">{form.loadErrorMessage}</Typography>
        ) : (
          <Stack component="form" spacing={2} onSubmit={form.saveSettings} noValidate>
            <ClientSettingsFields
              disabled={form.saving}
              onPayPeriodIntervalChange={form.setPayPeriodInterval}
              onPayPeriodStartDateChange={form.setPayPeriodStartDate}
              onTimeInputMethodChange={form.setTimeInputMethod}
              payPeriodInterval={form.payPeriodInterval}
              payPeriodIntervalRequired={form.payPeriodIntervalRequired}
              payPeriodStartDate={form.payPeriodStartDate}
              payPeriodStartDateDisabled={form.hasPayPeriods}
              payPeriodStartDateRequired={form.payPeriodStartDateRequired}
              timeInputMethod={form.timeInputMethod}
              timeInputMethodRequired={form.timeInputMethodRequired}
            />
            {form.errorMessage ? (
              <Typography color="error" variant="body2">
                {form.errorMessage}
              </Typography>
            ) : null}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button disabled={form.saving} onClick={() => navigate(`/client/${selectedClient?.clientId}`)}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={form.saving} loading={form.saving}>
                Save
              </Button>
            </Stack>
          </Stack>
        )}
      </Paper>
    </ClientManagementPage>
  );
};

export default ClientSettingsManagement;
