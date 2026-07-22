import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import StatusSwitch from '@/components/Shared/StatusSwitch/StatusSwitch';
import EmployeeStatusValue from '@/models/EmployeeStatusValue';
import type { EmployeeStatusValue as EmployeeStatusValueType } from '@/models/EmployeeStatusValue';

type Props = {
  disabled: boolean;
  email: string;
  emailRequired: boolean;
  firstName: string;
  firstNameRequired: boolean;
  lastName: string;
  lastNameRequired: boolean;
  onEmailChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onPositionChange: (value: string) => void;
  onStatusChange: (value: EmployeeStatusValueType) => void;
  position: string;
  positionRequired: boolean;
  status: EmployeeStatusValueType;
};

const EmployeeIdentityFields = ({
  disabled,
  email,
  emailRequired,
  firstName,
  firstNameRequired,
  lastName,
  lastNameRequired,
  onEmailChange,
  onFirstNameChange,
  onLastNameChange,
  onPositionChange,
  onStatusChange,
  position,
  positionRequired,
  status,
}: Props) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            autoFocus
            disabled={disabled}
            error={firstNameRequired}
            fullWidth
            helperText={firstNameRequired ? 'First name is required.' : undefined}
            label="First name"
            onChange={(event) => onFirstNameChange(event.target.value)}
            required
            value={firstName}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            disabled={disabled}
            error={lastNameRequired}
            fullWidth
            helperText={lastNameRequired ? 'Last name is required.' : undefined}
            label="Last name"
            onChange={(event) => onLastNameChange(event.target.value)}
            required
            value={lastName}
          />
        </Grid>
      </Grid>
      <TextField
        disabled={disabled}
        error={positionRequired}
        fullWidth
        helperText={positionRequired ? 'Position is required.' : undefined}
        label="Position"
        onChange={(event) => onPositionChange(event.target.value)}
        required
        value={position}
      />
      <TextField
        disabled={disabled}
        error={emailRequired}
        fullWidth
        helperText={emailRequired ? 'Email is required.' : undefined}
        label="Email"
        onChange={(event) => onEmailChange(event.target.value)}
        required
        type="email"
        value={email}
      />
      <StatusSwitch
        activeValue={EmployeeStatusValue.Active}
        disabled={disabled}
        inactiveValue={EmployeeStatusValue.Inactive}
        onChange={onStatusChange}
        value={status}
      />
    </>
  );
};

export default EmployeeIdentityFields;
