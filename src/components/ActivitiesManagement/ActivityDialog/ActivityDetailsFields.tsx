import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import {
  ActivityPayRateEnum,
  ActivityPayrollCategoryEnum,
} from '@/api/generated/models/Activity';
import type {
  ActivityPayRateEnum as ActivityPayRate,
  ActivityPayrollCategoryEnum as ActivityPayrollCategory,
} from '@/api/generated/models/Activity';
import currencyToString from '@/utils/currencyToString';
import { isFlatPayRate, payRateLabels } from '../activityDisplay';

type Props = {
  activityName: string;
  flatRateAmount: string;
  flatRateAmountInvalid: boolean;
  locked?: boolean;
  lockedMessage?: string;
  nameRequired: boolean;
  onActivityNameChange: (value: string) => void;
  onFlatRateAmountChange: (value: string) => void;
  onPayRateChange: (value: ActivityPayRate) => void;
  onPayrollCategoryChange: (value: ActivityPayrollCategory) => void;
  onTrackSeparatelyChange: (value: boolean) => void;
  payRate: ActivityPayRate;
  payrollCategory: ActivityPayrollCategory;
  saving: boolean;
  trackSeparately: boolean;
};

const payrollCategoryLabels: Record<ActivityPayrollCategory, string> = {
  [ActivityPayrollCategoryEnum.Regular]: 'Regular',
  [ActivityPayrollCategoryEnum.Eto]: 'ETO',
  [ActivityPayrollCategoryEnum.Pto]: 'PTO',
  [ActivityPayrollCategoryEnum.Sto]: 'STO',
};

const ActivityDetailsFields = ({
  activityName,
  flatRateAmount,
  flatRateAmountInvalid,
  locked = false,
  lockedMessage,
  nameRequired,
  onActivityNameChange,
  onFlatRateAmountChange,
  onPayRateChange,
  onPayrollCategoryChange,
  onTrackSeparatelyChange,
  payRate,
  payrollCategory,
  saving,
  trackSeparately,
}: Props) => {
  const disabled = saving || locked;

  const fields = (
    <Stack spacing={2}>
      <TextField
        autoFocus
        disabled={disabled}
        error={nameRequired}
        fullWidth
        helperText={nameRequired ? 'Activity name is required.' : undefined}
        label="Activity name"
        onChange={(event) => onActivityNameChange(event.target.value)}
        required
        value={activityName}
      />
      <FormControlLabel
        control={<Switch checked={trackSeparately} disabled={disabled} onChange={(event) => onTrackSeparatelyChange(event.target.checked)} />}
        label="Track separately"
      />
      <TextField
        disabled={disabled}
        fullWidth
        label="Payroll category"
        onChange={(event) => onPayrollCategoryChange(event.target.value as ActivityPayrollCategory)}
        select
        value={payrollCategory}
      >
        {Object.values(ActivityPayrollCategoryEnum).map((category) => (
          <MenuItem key={category} value={category}>
            {payrollCategoryLabels[category]}
          </MenuItem>
        ))}
      </TextField>
      <TextField disabled={disabled} fullWidth label="Pay rate" onChange={(event) => onPayRateChange(event.target.value as ActivityPayRate)} select value={payRate}>
        {Object.values(ActivityPayRateEnum).map((rate) => (
          <MenuItem key={rate} value={rate}>
            {payRateLabels[rate]}
          </MenuItem>
        ))}
      </TextField>
      {isFlatPayRate(payRate) ? (
        <TextField
          disabled={disabled}
          error={flatRateAmountInvalid}
          fullWidth
          helperText={flatRateAmountInvalid ? 'Flat rate amount must be a valid number.' : undefined}
          label="Flat rate amount"
          onBlur={() => onFlatRateAmountChange(currencyToString(flatRateAmount))}
          onChange={(event) => onFlatRateAmountChange(event.target.value)}
          value={flatRateAmount}
        />
      ) : null}
    </Stack>
  );

  return locked ? <Tooltip title={lockedMessage}>{fields}</Tooltip> : fields;
};

export default ActivityDetailsFields;
