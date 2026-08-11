import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import ClientIdentityFields from '@/components/ClientManagement/ClientIdentityFields/ClientIdentityFields';
import ClientSettingsFields from '@/components/ClientManagement/ClientSettingsFields/ClientSettingsFields';
import FolderChoiceFields from '@/components/ClientManagement/FolderChoiceFields/FolderChoiceFields';
import useClientCreateForm from './useClientCreateForm/useClientCreateForm';

const ClientCreate = () => {
  const form = useClientCreateForm();
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        New Client
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Stack component="form" spacing={3} onSubmit={form.createClient} noValidate>
          <Stack spacing={2}>
            <ClientIdentityFields
              clientCode={form.clientCode}
              clientCodeRequired={form.clientCodeRequired}
              clientName={form.clientName}
              clientNameRequired={form.clientNameRequired}
              disabled={form.saving}
              onClientCodeChange={form.setClientCode}
              onClientNameChange={form.setClientName}
            />
          </Stack>
          <FolderChoiceFields
            createNewExtraField={
              <TextField
                disabled={form.saving}
                error={form.rootFolderLinkRequired}
                fullWidth
                helperText={form.rootFolderLinkRequired ? 'Parent folder URL is required.' : undefined}
                label="Parent folder URL"
                onChange={(event) => form.setRootFolderLink(event.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                required
                value={form.rootFolderLink}
              />
            }
            disabled={form.saving}
            label="Employee Payroll Folder"
            linkRequired={form.employeePayrollFolderLinkRequired}
            linkValue={form.employeePayrollFolderLink}
            mode={form.employeePayrollFolderMode}
            onLinkChange={form.setEmployeePayrollFolderLink}
            onModeChange={form.setEmployeePayrollFolderMode}
          />
          <Box>
            <Link component="button" type="button" onClick={() => form.setAdvancedOpen(!form.advancedOpen)} underline="hover">
              Advanced
            </Link>
            <Collapse in={form.advancedOpen}>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <FolderChoiceFields
                  disabled={form.saving}
                  label="Payroll Config Folder"
                  linkRequired={form.payrollConfigFolderLinkRequired}
                  linkValue={form.payrollConfigFolderLink}
                  mode={form.payrollConfigFolderMode}
                  onLinkChange={form.setPayrollConfigFolderLink}
                  onModeChange={form.setPayrollConfigFolderMode}
                />
                <FolderChoiceFields
                  disabled={form.saving}
                  label="Payroll Report Folder"
                  linkRequired={form.payrollReportFolderLinkRequired}
                  linkValue={form.payrollReportFolderLink}
                  mode={form.payrollReportFolderMode}
                  onLinkChange={form.setPayrollReportFolderLink}
                  onModeChange={form.setPayrollReportFolderMode}
                />
              </Stack>
            </Collapse>
          </Box>
          <ClientSettingsFields
            disabled={form.saving}
            onPayPeriodIntervalChange={form.setPayPeriodInterval}
            onPayPeriodStartDateChange={form.setPayPeriodStartDate}
            onTimeInputMethodChange={form.setTimeInputMethod}
            payPeriodInterval={form.payPeriodInterval}
            payPeriodIntervalRequired={form.payPeriodIntervalRequired}
            payPeriodStartDate={form.payPeriodStartDate}
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
            <Button disabled={form.saving} onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={form.saving} loading={form.saving}>
              Create
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ClientCreate;
