import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PayrollReportFlatRateList from '@/components/PayPeriod/PayrollReportTable/PayrollReportTableRow/PayrollReportFlatRateList';
import PayrollReportHourlyList from '@/components/PayPeriod/PayrollReportTable/PayrollReportTableRow/PayrollReportHourlyList';
import type { PayrollReportRow } from '@/components/PayPeriod/PayrollReportTable/PayrollReportRow';
import currencyToString from '@/utils/currencyToString';

type Props = {
  row: PayrollReportRow;
  expanded: boolean;
  onToggleExpand: (employeeId: string) => void;
  editedValues: Record<string, string>;
  onEditValue: (employeeId: string, value: string) => void;
  onBlurValue: (employeeId: string) => void;
};

const formatNumber = (value: number | undefined | null): string => (value ?? 0).toFixed(2);

const PayrollReportTableRow = ({ row, expanded, onToggleExpand, editedValues, onEditValue, onBlurValue }: Props) => {
  const hasDetail = row.hourly.some((entry) => (entry.totalHours ?? 0) !== 0) || row.flatRate.some((entry) => (entry.quantity ?? 0) !== 0);

  return (
    <>
      <TableRow>
        <TableCell>
          {hasDetail && (
            <IconButton size="small" aria-label={expanded ? 'Collapse row' : 'Expand row'} onClick={() => onToggleExpand(row.employeeId)}>
              {expanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
            </IconButton>
          )}
        </TableCell>
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
      {hasDetail && (
        <TableRow>
          <TableCell sx={{ py: 0 }} colSpan={5}>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box sx={{ py: 2 }}>
                <Stack spacing={2}>
                  {row.hourly.some((entry) => (entry.totalHours ?? 0) !== 0) && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Hourly
                      </Typography>
                      <PayrollReportHourlyList hourly={row.hourly} />
                    </Box>
                  )}
                  {row.flatRate.some((entry) => (entry.quantity ?? 0) !== 0) && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Flat Rate
                      </Typography>
                      <PayrollReportFlatRateList flatRate={row.flatRate} />
                    </Box>
                  )}
                </Stack>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default PayrollReportTableRow;
