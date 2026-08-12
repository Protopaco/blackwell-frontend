import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { SettingsPayPeriodIntervalEnum, SettingsTimeInputMethodEnum } from '@/api/generated/models/Settings';

type Props = {
  disabled: boolean;
  onPayPeriodIntervalChange: (value: SettingsPayPeriodIntervalEnum) => void;
  onPayPeriodStartDateChange: (value: string) => void;
  onTimeInputMethodChange: (value: SettingsTimeInputMethodEnum) => void;
  payPeriodInterval: SettingsPayPeriodIntervalEnum | '';
  payPeriodIntervalRequired: boolean;
  payPeriodStartDate: string;
  // True once the client has at least one pay period — payPeriodStartDate is only ever read by
  // getNextPayPeriod before the first pay period exists, so it's locked (with an explanation) after that.
  payPeriodStartDateDisabled?: boolean;
  payPeriodStartDateRequired: boolean;
  timeInputMethod: SettingsTimeInputMethodEnum | '';
  timeInputMethodRequired: boolean;
};

const timeInputMethodLabels: Record<SettingsTimeInputMethodEnum, string> = {
  [SettingsTimeInputMethodEnum.TotalHours]: 'Total Hours',
  [SettingsTimeInputMethodEnum.ClockInOut]: 'Clock In/Out',
};

const payPeriodIntervalLabels: Record<SettingsPayPeriodIntervalEnum, string> = {
  [SettingsPayPeriodIntervalEnum.Weekly]: 'Weekly',
  [SettingsPayPeriodIntervalEnum.BiWeekly]: 'Bi-Weekly',
  [SettingsPayPeriodIntervalEnum.Monthly]: 'Monthly',
};

const ClientSettingsFields = ({
  disabled,
  onPayPeriodIntervalChange,
  onPayPeriodStartDateChange,
  onTimeInputMethodChange,
  payPeriodInterval,
  payPeriodIntervalRequired,
  payPeriodStartDate,
  payPeriodStartDateDisabled = false,
  payPeriodStartDateRequired,
  timeInputMethod,
  timeInputMethodRequired,
}: Props) => {
  return (
    <Stack spacing={2}>
      <TextField
        disabled={disabled}
        error={timeInputMethodRequired}
        fullWidth
        helperText={timeInputMethodRequired ? 'Time input method is required.' : undefined}
        label="Time input method"
        onChange={(event) => onTimeInputMethodChange(event.target.value as SettingsTimeInputMethodEnum)}
        required
        select
        value={timeInputMethod}
      >
        {Object.values(SettingsTimeInputMethodEnum).map((value) => (
          <MenuItem key={value} value={value}>
            {timeInputMethodLabels[value]}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        disabled={disabled}
        error={payPeriodIntervalRequired}
        fullWidth
        helperText={payPeriodIntervalRequired ? 'Pay period interval is required.' : undefined}
        label="Pay period interval"
        onChange={(event) => onPayPeriodIntervalChange(event.target.value as SettingsPayPeriodIntervalEnum)}
        required
        select
        value={payPeriodInterval}
      >
        {Object.values(SettingsPayPeriodIntervalEnum).map((value) => (
          <MenuItem key={value} value={value}>
            {payPeriodIntervalLabels[value]}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        disabled={disabled || payPeriodStartDateDisabled}
        error={payPeriodStartDateRequired}
        fullWidth
        helperText={
          payPeriodStartDateRequired
            ? 'Pay period start date is required.'
            : payPeriodStartDateDisabled
              ? 'This client already has pay period history — this value is no longer used.'
              : undefined
        }
        label="Pay period start date"
        onChange={(event) => onPayPeriodStartDateChange(event.target.value)}
        required
        slotProps={{ inputLabel: { shrink: true } }}
        type="date"
        value={payPeriodStartDate}
      />
    </Stack>
  );
};

export default ClientSettingsFields;
