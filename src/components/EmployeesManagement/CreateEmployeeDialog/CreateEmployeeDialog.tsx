import Stack from '@mui/material/Stack';
import ManagementDialog from '@/components/Shared/ManagementDialog/ManagementDialog';
import EmployeeIdentityFields from './EmployeeIdentityFields/EmployeeIdentityFields';
import EmployeePayRateFields from './EmployeePayRateFields/EmployeePayRateFields';
import EmployeeTimesheetSetupFields from './EmployeeTimesheetSetupFields/EmployeeTimesheetSetupFields';
import useCreateEmployeeForm from './useCreateEmployeeForm/useCreateEmployeeForm';

type Props = {
  clientId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const CreateEmployeeDialog = ({ clientId, open, onClose, onCreated }: Props) => {
  const form = useCreateEmployeeForm({ clientId, open, onClose, onCreated });

  return (
    <ManagementDialog
      errorMessage={form.errorMessage}
      formId="create-employee-form"
      onClose={form.closeDialog}
      open={open}
      saving={form.saving}
      submitLabel="Create"
      title="Create Employee"
    >
      <Stack component="form" id="create-employee-form" spacing={2} onSubmit={form.createEmployee} noValidate>
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
        <EmployeeTimesheetSetupFields
          disabled={form.saving}
          loadingTimesheetFolders={form.loadingTimesheetFolders}
          noActiveTimesheetFolders={form.noActiveTimesheetFolders}
          onTimesheetFileIdChange={form.setTimesheetFileId}
          onTimesheetFolderIdChange={form.setTimesheetFolderId}
          onTimesheetSetupModeChange={form.setTimesheetSetupMode}
          timesheetFileId={form.timesheetFileId}
          timesheetFileRequired={form.timesheetFileRequired}
          timesheetFolderErrorMessage={form.timesheetFolderErrorMessage}
          timesheetFolderId={form.timesheetFolderId}
          timesheetFolderRequired={form.timesheetFolderRequired}
          timesheetFolders={form.timesheetFolders}
          timesheetSetupMode={form.timesheetSetupMode}
        />
      </Stack>
    </ManagementDialog>
  );
};

export default CreateEmployeeDialog;
