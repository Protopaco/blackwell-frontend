import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { payrollReportApi } from '@/api/client';
import useAsyncAction from '@/hooks/useAsyncAction';
import EmployeeTimesheetStatusChip from '@/components/Shared/EmployeeTimesheetStatusChip/EmployeeTimesheetStatusChip';
import ErrorTooltip from '@/components/Shared/ErrorTooltip/ErrorTooltip';
import type { EmployeeTimesheetStatusStatusEnum } from '@/api/generated/models/EmployeeTimesheetStatus';
import '@/components/PayPeriodDashboard/EmployeeTimesheetStatusCard/EmployeeTimesheetStatusRow/EmployeeTimesheetStatusRow.css';

type Props = {
  employeeId: string;
  employeeName: string;
  status?: EmployeeTimesheetStatusStatusEnum;
  activeThisPayPeriod: boolean;
  totalExpense: number | null;
  onSaved: () => void;
};

const EmployeeTimesheetStatusRow = ({ employeeId, employeeName, status, activeThisPayPeriod, totalExpense, onSaved }: Props) => {
  const { clientId, payPeriodId } = useParams<{ clientId: string; payPeriodId: string }>();
  const [included, setIncluded] = useState(activeThisPayPeriod);

  useEffect(() => {
    setIncluded(activeThisPayPeriod);
  }, [activeThisPayPeriod]);

  const {
    run: toggleIncluded,
    loading,
    errorMessage,
  } = useAsyncAction(async () => {
    const nextValue = !included;
    setIncluded(nextValue);

    try {
      await payrollReportApi.v1UpdateEmployeeExpenses({
        clientId: clientId!,
        payPeriodId: payPeriodId!,
        employeeExpense: { employeeId, employeeName, activeThisPayPeriod: nextValue, totalExpense },
      });
      onSaved();
    } catch (error) {
      setIncluded(!nextValue);
      throw error;
    }
  }, 'Failed to update employee status.');

  return (
    <TableRow className="employee-timesheet-status-row">
      <TableCell>{employeeName}</TableCell>
      <TableCell>{status && <EmployeeTimesheetStatusChip status={status} />}</TableCell>
      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          <Switch checked={included} onChange={toggleIncluded} disabled={loading} size="small" />
          <Typography variant="body2">{included ? 'Included' : 'Ignored'}</Typography>
          {errorMessage && <ErrorTooltip message={errorMessage} />}
        </Stack>
      </TableCell>
      <TableCell />
    </TableRow>
  );
};

export default EmployeeTimesheetStatusRow;
