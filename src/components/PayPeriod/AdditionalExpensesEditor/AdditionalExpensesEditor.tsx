import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AdditionalExpenseRow from './AdditionalExpenseRow';
import type { AdditionalExpenseFormRow } from './AdditionalExpenseFormRow';

type RowValidation = {
  amountInvalid: boolean;
  nameInvalid: boolean;
};

type Props = {
  errorMessage: string | null;
  evaluateRow: (row: AdditionalExpenseFormRow) => RowValidation;
  onAddRow: () => void;
  onBlurAmount: (index: number) => void;
  onChangeRow: (index: number, row: AdditionalExpenseFormRow) => void;
  onRemoveRow: (index: number) => void;
  onSave: () => void;
  rows: AdditionalExpenseFormRow[];
  saveDisabled: boolean;
  saving: boolean;
};

const AdditionalExpensesEditor = ({ errorMessage, evaluateRow, onAddRow, onBlurAmount, onChangeRow, onRemoveRow, onSave, rows, saveDisabled, saving }: Props) => {
  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">Additional Expenses</Typography>
      <Stack spacing={1}>
        {rows.map((row, index) => {
          const { nameInvalid, amountInvalid } = evaluateRow(row);
          return (
            <AdditionalExpenseRow
              key={index}
              amountInvalid={amountInvalid}
              disabled={saving}
              index={index}
              nameInvalid={nameInvalid}
              onBlurAmount={onBlurAmount}
              onChange={onChangeRow}
              onRemove={onRemoveRow}
              row={row}
            />
          );
        })}
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button disabled={saving} onClick={onAddRow} startIcon={<AddIcon />} variant="text">
          Add Expense
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button disabled={saveDisabled} loading={saving} onClick={onSave} variant="contained">
          Save Additional Expenses
        </Button>
      </Stack>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
    </Stack>
  );
};

export default AdditionalExpensesEditor;
