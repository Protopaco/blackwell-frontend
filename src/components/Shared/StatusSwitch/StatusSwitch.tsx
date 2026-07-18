import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

type Props<TValue extends string> = {
  activeValue: TValue;
  disabled?: boolean;
  onChange: (value: TValue) => void;
  inactiveValue: TValue;
  value: TValue;
};

const StatusSwitch = <TValue extends string>({
  activeValue,
  disabled = false,
  onChange,
  inactiveValue,
  value,
}: Props<TValue>) => {
  const checked = value === activeValue;

  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked ? activeValue : inactiveValue)}
        />
      }
      label={checked ? 'Active' : 'Inactive'}
    />
  );
};

export default StatusSwitch;
