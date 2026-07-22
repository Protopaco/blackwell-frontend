import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import PayrollReportTableRow from '@/components/PayPeriod/PayrollReportTable/PayrollReportTableRow/PayrollReportTableRow';
import type { PayrollReportRow } from '@/components/PayPeriod/PayrollReportTable/PayrollReportRow';

type Props = {
  rows: PayrollReportRow[];
  editedValues: Record<string, string>;
  onEditValue: (employeeId: string, value: string) => void;
  onBlurValue: (employeeId: string) => void;
};

const PayrollReportTable = ({ rows, editedValues, onEditValue, onBlurValue }: Props) => {
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
        headers={[{ label: '' }, { label: 'Employee' }, { label: 'Total Hours' }, { label: 'Flat Rate Quantity' }, { label: 'Total Expense' }]}
      >
        {rows.map((row) => (
          <PayrollReportTableRow
            key={row.employeeId}
            row={row}
            expanded={expandedIds.has(row.employeeId)}
            onToggleExpand={toggleExpand}
            editedValues={editedValues}
            onEditValue={onEditValue}
            onBlurValue={onBlurValue}
          />
        ))}
      </ManagementTable>
    </Stack>
  );
};

export default PayrollReportTable;
