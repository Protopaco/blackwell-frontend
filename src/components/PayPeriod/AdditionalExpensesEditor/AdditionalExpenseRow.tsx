import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { AdditionalExpenseFormRow } from './AdditionalExpenseFormRow';

type Props = {
  amountInvalid: boolean;
  disabled: boolean;
  index: number;
  nameInvalid: boolean;
  onBlurAmount: (index: number) => void;
  onChange: (index: number, row: AdditionalExpenseFormRow) => void;
  onRemove: (index: number) => void;
  row: AdditionalExpenseFormRow;
};

const AdditionalExpenseRow = ({ amountInvalid, disabled, index, nameInvalid, onBlurAmount, onChange, onRemove, row }: Props) => {
  return (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <TextField
        disabled={disabled}
        error={nameInvalid}
        helperText={nameInvalid ? 'Expense name is required.' : undefined}
        label="Expense Name"
        onChange={(event) => onChange(index, { ...row, expenseName: event.target.value })}
        sx={{ flex: 1 }}
        value={row.expenseName}
      />
      <TextField
        disabled={disabled}
        error={amountInvalid}
        helperText={amountInvalid ? 'Enter a valid, non-negative amount.' : undefined}
        label="Amount"
        onBlur={() => onBlurAmount(index)}
        onChange={(event) => onChange(index, { ...row, amount: event.target.value })}
        slotProps={{ htmlInput: { inputMode: 'decimal', 'aria-label': `Amount for ${row.expenseName || 'expense'}` } }}
        sx={{ width: 160 }}
        value={row.amount}
      />
      <IconButton aria-label="Remove additional expense" disabled={disabled} onClick={() => onRemove(index)} size="small" sx={{ mt: 1 }}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
};

export default AdditionalExpenseRow;
