import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import PayrollReportTableRow from '@/components/PayPeriod/PayrollReportTable/PayrollReportTableRow/PayrollReportTableRow';
import type { PayrollReportRow } from '@/components/PayPeriod/PayrollReportTable/PayrollReportRow';

type Props = {
  rows: PayrollReportRow[];
  editedWageValues: Record<string, string>;
  editedTaxValues: Record<string, string>;
  onEditWageValue: (employeeId: string, value: string) => void;
  onEditTaxValue: (employeeId: string, value: string) => void;
  onBlurWageValue: (employeeId: string) => void;
  onBlurTaxValue: (employeeId: string) => void;
};

const PayrollReportTable = ({
  rows,
  editedWageValues,
  editedTaxValues,
  onEditWageValue,
  onEditTaxValue,
  onBlurWageValue,
  onBlurTaxValue,
}: Props) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (employeeId: string) => {
    setExpandedIds((previous) => {
      const next = new Set(previous);
      if (next.has(employeeId)) {
        next.delete(employeeId);
      } else {
        next.add(employeeId);
      }
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(rows.map((row) => row.employeeId)));
  const collapseAll = () => setExpandedIds(new Set());

  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="flex-end">
        <Button size="small" onClick={expandAll}>
          Expand all
        </Button>
        <Button size="small" onClick={collapseAll}>
          Collapse all
        </Button>
      </Stack>
      <ManagementTable
        headers={[
          { label: '' },
          { label: 'Employee' },
          { label: 'Total Hours' },
          { label: 'Flat Rate Quantity' },
          { label: 'Wage Expense' },
          { label: 'Tax Expense' },
        ]}
      >
        {rows.map((row) => (
          <PayrollReportTableRow
            key={row.employeeId}
            row={row}
            expanded={expandedIds.has(row.employeeId)}
            onToggleExpand={toggleExpand}
            editedWageValues={editedWageValues}
            editedTaxValues={editedTaxValues}
            onEditWageValue={onEditWageValue}
            onEditTaxValue={onEditTaxValue}
            onBlurWageValue={onBlurWageValue}
            onBlurTaxValue={onBlurTaxValue}
          />
        ))}
      </ManagementTable>
    </Stack>
  );
};

export default PayrollReportTable;
