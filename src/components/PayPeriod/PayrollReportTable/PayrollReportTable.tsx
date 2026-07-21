import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import type { PayrollReportRow } from '@/components/PayPeriod/PayrollReportTable/PayrollReportRow';
import currencyToString from '@/utils/currencyToString';

type Props = {
  rows: PayrollReportRow[];
  editedValues: Record<string, string>;
  onEditValue: (employeeId: string, value: string) => void;
  onBlurValue: (employeeId: string) => void;
};

const formatNumber = (value: number | undefined | null): string => (value ?? 0).toFixed(2);

const PayrollReportTable = ({ rows, editedValues, onEditValue, onBlurValue }: Props) => {
  return (
    <ManagementTable headers={[{ label: 'Employee' }, { label: 'Total Hours' }, { label: 'Flat Rate Quantity' }, { label: 'Total Expense' }]}>
      {rows.map((row) => (
        <TableRow key={row.employeeId}>
          <TableCell>{row.employeeName}</TableCell>
          <TableCell>{formatNumber(row.totalHours)}</TableCell>
          <TableCell>{formatNumber(row.totalFlatRate)}</TableCell>
          <TableCell>
            <TextField
              size="small"
              value={editedValues[row.employeeId] ?? currencyToString(row.totalExpense ?? undefined)}
              onChange={(event) => onEditValue(row.employeeId, event.target.value)}
              onBlur={() => onBlurValue(row.employeeId)}
              slotProps={{ htmlInput: { inputMode: 'decimal', 'aria-label': `Total expense for ${row.employeeName}` } }}
            />
          </TableCell>
        </TableRow>
      ))}
    </ManagementTable>
  );
};

export default PayrollReportTable;
