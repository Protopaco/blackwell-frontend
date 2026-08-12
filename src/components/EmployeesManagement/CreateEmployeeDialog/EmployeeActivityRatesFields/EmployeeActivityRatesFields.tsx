import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { EmployeeActivityRatePayRateTypeEnum } from '@/api/generated/models/EmployeeActivityRate';
import type { Activity } from '@/api/generated/models/Activity';
import currencyToString from '@/utils/currencyToString';
import type { EmployeeActivityRateFormRow } from './EmployeeActivityRateFormRow';

type Props = {
  activities: Activity[];
  activityRates: EmployeeActivityRateFormRow[];
  disabled: boolean;
  duplicateActivity: boolean;
  onAddActivityRate: () => void;
  onRemoveActivityRate: (index: number) => void;
  onUpdateActivityRate: (index: number, activityRate: EmployeeActivityRateFormRow) => void;
  selectedActivityIds: string[];
  submitted: boolean;
};

const payRateTypeLabels: Record<EmployeeActivityRatePayRateTypeEnum, string> = {
  [EmployeeActivityRatePayRateTypeEnum.Hourly]: 'Hourly',
  [EmployeeActivityRatePayRateTypeEnum.FlatRate]: 'Flat rate',
  [EmployeeActivityRatePayRateTypeEnum.Salary]: 'Salary',
};

const EmployeeActivityRatesFields = ({
  activities,
  activityRates,
  disabled,
  duplicateActivity,
  onAddActivityRate,
  onRemoveActivityRate,
  onUpdateActivityRate,
  selectedActivityIds,
  submitted,
}: Props) => {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Activity rates</Typography>
      {activityRates.map((activityRate, index) => {
        const availableActivities = activities.filter(
          (activity) => activity.activityId === activityRate.activityId || !selectedActivityIds.includes(activity.activityId ?? ''),
        );
        const isSalary = activityRate.payRateType === EmployeeActivityRatePayRateTypeEnum.Salary;
        const activityInvalid = submitted && !activityRate.activityId;
        const payRateInvalid =
          submitted && !isSalary && (activityRate.payRate === '' || Number.isNaN(Number(activityRate.payRate)));
        const holidayPayRateInvalid =
          submitted && !isSalary && (activityRate.holidayPayRate === '' || Number.isNaN(Number(activityRate.holidayPayRate)));

        return (
          <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
            <TextField
              disabled={disabled}
              error={activityInvalid}
              helperText={activityInvalid ? 'Activity is required.' : undefined}
              label="Activity"
              onChange={(event) => onUpdateActivityRate(index, { ...activityRate, activityId: event.target.value })}
              select
              sx={{ flex: 1 }}
              value={activityRate.activityId}
            >
              {availableActivities.map((activity) => (
                <MenuItem key={activity.activityId} value={activity.activityId}>
                  {activity.activityName}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled={disabled}
              label="Pay rate type"
              onChange={(event) =>
                onUpdateActivityRate(index, { ...activityRate, payRateType: event.target.value as EmployeeActivityRatePayRateTypeEnum })
              }
              select
              sx={{ width: 140 }}
              value={activityRate.payRateType}
            >
              {Object.values(EmployeeActivityRatePayRateTypeEnum).map((payRateType) => (
                <MenuItem key={payRateType} value={payRateType}>
                  {payRateTypeLabels[payRateType]}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled={disabled || isSalary}
              error={payRateInvalid}
              helperText={payRateInvalid ? 'Required.' : undefined}
              label="Pay rate"
              onBlur={() => onUpdateActivityRate(index, { ...activityRate, payRate: currencyToString(activityRate.payRate) })}
              onChange={(event) => onUpdateActivityRate(index, { ...activityRate, payRate: event.target.value })}
              slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
              sx={{ width: 130 }}
              type="number"
              value={activityRate.payRate}
            />
            <TextField
              disabled={disabled || isSalary}
              error={holidayPayRateInvalid}
              helperText={holidayPayRateInvalid ? 'Required.' : undefined}
              label="Holiday pay rate"
              onBlur={() => onUpdateActivityRate(index, { ...activityRate, holidayPayRate: currencyToString(activityRate.holidayPayRate) })}
              onChange={(event) => onUpdateActivityRate(index, { ...activityRate, holidayPayRate: event.target.value })}
              slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
              sx={{ width: 140 }}
              type="number"
              value={activityRate.holidayPayRate}
            />
            <IconButton aria-label="Remove activity rate" disabled={disabled} onClick={() => onRemoveActivityRate(index)} sx={{ mt: 1 }} size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        );
      })}
      <Button
        disabled={disabled || activities.length <= activityRates.length}
        onClick={onAddActivityRate}
        startIcon={<AddIcon />}
        variant="text"
      >
        Add activity
      </Button>
      {duplicateActivity ? (
        <Typography color="error" variant="body2">
          Each activity can only be assigned once.
        </Typography>
      ) : null}
    </Stack>
  );
};

export default EmployeeActivityRatesFields;
