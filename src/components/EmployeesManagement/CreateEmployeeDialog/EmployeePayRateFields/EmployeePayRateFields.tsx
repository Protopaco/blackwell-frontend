import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import currencyToString from '@/utils/currencyToString';

type Props = {
  disabled: boolean;
  holidayPayRate: string;
  holidayPayRateInvalid: boolean;
  hourlyPayRate1: string;
  hourlyPayRate1Invalid: boolean;
  hourlyPayRate2: string;
  hourlyPayRate2Invalid: boolean;
  onHolidayPayRateChange: (value: string) => void;
  onHourlyPayRate1Change: (value: string) => void;
  onHourlyPayRate2Change: (value: string) => void;
};

const EmployeePayRateFields = ({
  disabled,
  holidayPayRate,
  holidayPayRateInvalid,
  hourlyPayRate1,
  hourlyPayRate1Invalid,
  hourlyPayRate2,
  hourlyPayRate2Invalid,
  onHolidayPayRateChange,
  onHourlyPayRate1Change,
  onHourlyPayRate2Change,
}: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          disabled={disabled}
          error={hourlyPayRate1Invalid}
          fullWidth
          helperText={hourlyPayRate1Invalid ? 'Enter a pay rate.' : undefined}
          label="Hourly pay rate 1"
          onBlur={() => onHourlyPayRate1Change(currencyToString(hourlyPayRate1))}
          onChange={(event) => onHourlyPayRate1Change(event.target.value)}
          required
          slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
          type="number"
          value={hourlyPayRate1}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          disabled={disabled}
          error={hourlyPayRate2Invalid}
          fullWidth
          helperText={hourlyPayRate2Invalid ? 'Enter a pay rate.' : undefined}
          label="Hourly pay rate 2"
          onBlur={() => onHourlyPayRate2Change(currencyToString(hourlyPayRate2))}
          onChange={(event) => onHourlyPayRate2Change(event.target.value)}
          required
          slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
          type="number"
          value={hourlyPayRate2}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          disabled={disabled}
          error={holidayPayRateInvalid}
          fullWidth
          helperText={holidayPayRateInvalid ? 'Enter a pay rate.' : undefined}
          label="Holiday pay rate"
          onBlur={() => onHolidayPayRateChange(currencyToString(holidayPayRate))}
          onChange={(event) => onHolidayPayRateChange(event.target.value)}
          required
          slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
          type="number"
          value={holidayPayRate}
        />
      </Grid>
    </Grid>
  );
};

export default EmployeePayRateFields;
