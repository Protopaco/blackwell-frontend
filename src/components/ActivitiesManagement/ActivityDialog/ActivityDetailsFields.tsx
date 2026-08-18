import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { ActivityPayrollCategoryEnum } from '@/api/generated/models/Activity';
import type { ActivityPayrollCategoryEnum as ActivityPayrollCategory } from '@/api/generated/models/Activity';

type Props = {
  activityName: string;
  groupLabel: string | null;
  groupLabelOptions: string[];
  locked?: boolean;
  lockedMessage?: string;
  nameRequired: boolean;
  onActivityNameChange: (value: string) => void;
  onGroupLabelChange: (value: string | null) => void;
  onPayrollCategoryChange: (value: ActivityPayrollCategory) => void;
  payrollCategory: ActivityPayrollCategory;
  saving: boolean;
};

const payrollCategoryLabels: Record<ActivityPayrollCategory, string> = {
  [ActivityPayrollCategoryEnum.Regular]: 'Regular',
  [ActivityPayrollCategoryEnum.Eto]: 'ETO',
  [ActivityPayrollCategoryEnum.Pto]: 'PTO',
  [ActivityPayrollCategoryEnum.Sto]: 'STO',
};

const ActivityDetailsFields = ({
  activityName,
  groupLabel,
  groupLabelOptions,
  locked = false,
  lockedMessage,
  nameRequired,
  onActivityNameChange,
  onGroupLabelChange,
  onPayrollCategoryChange,
  payrollCategory,
  saving,
}: Props) => {
  const disabled = saving || locked;

  const fields = (
    <Stack spacing={2}>
      <TextField
        disabled={disabled}
        error={nameRequired}
        fullWidth
        helperText={nameRequired ? 'Activity name is required.' : undefined}
        label="Activity name"
        onChange={(event) => onActivityNameChange(event.target.value)}
        required
        value={activityName}
      />
      <Autocomplete
        disabled={disabled}
        freeSolo
        fullWidth
        inputValue={groupLabel ?? ''}
        onInputChange={(_event, newInputValue) => onGroupLabelChange(newInputValue || null)}
        options={groupLabelOptions}
        renderInput={(params) => <TextField {...params} label="Group" />}
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
    </Stack>
  );

  return locked ? <Tooltip title={lockedMessage}>{fields}</Tooltip> : fields;
};

export default ActivityDetailsFields;
