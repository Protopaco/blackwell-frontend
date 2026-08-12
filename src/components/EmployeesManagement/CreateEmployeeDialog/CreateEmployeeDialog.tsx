import Stack from '@mui/material/Stack';
import ManagementDialog from '@/components/Shared/ManagementDialog/ManagementDialog';
import EmployeeActivityRatesFields from './EmployeeActivityRatesFields/EmployeeActivityRatesFields';
import EmployeeIdentityFields from './EmployeeIdentityFields/EmployeeIdentityFields';
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
      maxWidth="md"
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
          onSalariedChange={form.setSalaried}
          onSalaryAmountChange={form.setSalaryAmount}
          onStatusChange={form.setStatus}
          position={form.position}
          positionRequired={form.positionRequired}
          salaried={form.salaried}
          salaryAmount={form.salaryAmount}
          salaryAmountInvalid={form.salaryAmountInvalid}
          status={form.status}
        />
        <EmployeeActivityRatesFields
          activities={form.activities}
          activityRates={form.activityRates}
          disabled={form.saving}
          duplicateActivity={form.duplicateActivity}
          onAddActivityRate={form.addActivityRate}
          onRemoveActivityRate={form.removeActivityRate}
          onUpdateActivityRate={form.updateActivityRate}
          selectedActivityIds={form.selectedActivityIds}
          submitted={form.submitted}
        />
        <EmployeeTimesheetSetupFields
          disabled={form.saving}
          loadingTimesheetFolders={form.loadingTimesheetFolders}
          noActiveTimesheetFolders={form.noActiveTimesheetFolders}
          onTimesheetFileLinkChange={form.setTimesheetFileLink}
          onTimesheetFolderIdChange={form.setTimesheetFolderId}
          onTimesheetSetupModeChange={form.setTimesheetSetupMode}
          timesheetFileLink={form.timesheetFileLink}
          timesheetFileLinkRequired={form.timesheetFileLinkRequired}
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
