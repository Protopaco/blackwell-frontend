import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import type { AllocationReportRow } from '@/api/generated/models/AllocationReportRow';
import currencyToString from '@/utils/currencyToString';

type Props = {
  rows: AllocationReportRow[];
};

const formatCurrency = (value: number | undefined): string => (value === undefined || value === null ? '-' : currencyToString(value, { decorated: true }));

const AllocationReportTable = ({ rows }: Props) => {
  return (
    <ManagementTable headers={[{ label: 'Funding Source' }, { label: 'Wages Allocation' }, { label: 'Additional Expenses' }, { label: 'Total' }]}>
      {rows.map((row, index) => (
        <TableRow key={`${row.fundingSourceName ?? 'unknown'}-${index}`}>
          <TableCell>{row.fundingSourceName}</TableCell>
          <TableCell>{formatCurrency(row.wagesAllocation)}</TableCell>
          <TableCell>{formatCurrency(row.additionalExpenses)}</TableCell>
          <TableCell>{formatCurrency(row.total)}</TableCell>
        </TableRow>
      ))}
    </ManagementTable>
  );
};

export default AllocationReportTable;
