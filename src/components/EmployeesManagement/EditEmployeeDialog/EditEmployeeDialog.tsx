import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { Employee } from '@/api/generated/models/Employee';
import EmployeeIdentityFields from '@/components/EmployeesManagement/CreateEmployeeDialog/EmployeeIdentityFields/EmployeeIdentityFields';
import EmployeePayRateFields from '@/components/EmployeesManagement/CreateEmployeeDialog/EmployeePayRateFields/EmployeePayRateFields';
import ManagementDialog from '@/components/Shared/ManagementDialog/ManagementDialog';
import useEditEmployeeForm from './useEditEmployeeForm/useEditEmployeeForm';

type Props = {
  clientId: string;
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

const EditEmployeeDialog = ({ clientId, employee, open, onClose, onSaved }: Props) => {
  const form = useEditEmployeeForm({ clientId, employee, open, onClose, onSaved });
  const timesheetUrl = form.timesheetFileId ? `https://docs.google.com/spreadsheets/d/${form.timesheetFileId}/edit` : null;

  return (
    <ManagementDialog
      errorMessage={form.errorMessage}
      formId="edit-employee-form"
      onClose={form.closeDialog}
      open={open}
      saving={form.saving}
      submitLabel="Save"
      title="Edit Employee"
    >
      <Stack component="form" id="edit-employee-form" spacing={2} onSubmit={form.saveEmployee} noValidate>
        <EmployeeIdentityFields
          disabled={form.saving}
          email={form.email}
          emailRequired={form.emailRequired}
          firstName={form.firstName}
          firstNameRequired={form.firstNameRequired}
          lastName={form.lastName}
          lastNameRequired={form.lastNameRequired}
          onEmailChange={form.setEmail}
          onFirstNameChange={form.setFirstName}
          onLastNameChange={form.setLastName}
          onPositionChange={form.setPosition}
          onStatusChange={form.setStatus}
          position={form.position}
          positionRequired={form.positionRequired}
          status={form.status}
        />
        <EmployeePayRateFields
          disabled={form.saving}
          holidayPayRate={form.holidayPayRate}
          holidayPayRateInvalid={form.holidayPayRateInvalid}
          hourlyPayRate1={form.hourlyPayRate1}
          hourlyPayRate1Invalid={form.hourlyPayRate1Invalid}
          hourlyPayRate2={form.hourlyPayRate2}
          hourlyPayRate2Invalid={form.hourlyPayRate2Invalid}
          onHolidayPayRateChange={form.setHolidayPayRate}
          onHourlyPayRate1Change={form.setHourlyPayRate1}
          onHourlyPayRate2Change={form.setHourlyPayRate2}
        />
        <TextField
          disabled
          fullWidth
          label="Timesheet file ID"
          value={form.timesheetFileId}
          slotProps={{
            input: {
              readOnly: true,
              endAdornment: timesheetUrl ? (
                <InputAdornment position="end">
                  <IconButton aria-label="Open timesheet" component="a" href={timesheetUrl} rel="noreferrer" target="_blank" size="small">
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
      </Stack>
    </ManagementDialog>
  );
};

export default EditEmployeeDialog;
