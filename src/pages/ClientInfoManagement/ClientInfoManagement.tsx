import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { ClientStatusEnum } from '@/api/generated/models/Client';
import ClientIdentityFields from '@/components/ClientManagement/ClientIdentityFields/ClientIdentityFields';
import ClientManagementPage from '@/components/Shared/ClientManagementPage/ClientManagementPage';
import StatusSwitch from '@/components/Shared/StatusSwitch/StatusSwitch';
import useSelectedClient from '@/state/client/useSelectedClient';
import useClientInfoForm from './useClientInfoForm/useClientInfoForm';

const ClientInfoManagement = () => {
  const { selectedClient } = useSelectedClient();
  const form = useClientInfoForm(selectedClient);
  const navigate = useNavigate();

  return (
    <ClientManagementPage title="Client Information">
      <Paper sx={{ p: 3 }}>
        <Stack component="form" spacing={2} onSubmit={form.saveClient} noValidate>
          <ClientIdentityFields
            clientCode={form.clientCode}
            clientCodeRequired={form.clientCodeRequired}
            clientName={form.clientName}
            clientNameRequired={form.clientNameRequired}
            disabled={form.saving}
            onClientCodeChange={form.setClientCode}
            onClientNameChange={form.setClientName}
          />
          <StatusSwitch
            activeValue={ClientStatusEnum.Active}
            disabled={form.saving}
            inactiveValue={ClientStatusEnum.Inactive}
            onChange={form.setStatus}
            value={form.status}
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
      </Paper>
    </ClientManagementPage>
  );
};

export default ClientInfoManagement;
