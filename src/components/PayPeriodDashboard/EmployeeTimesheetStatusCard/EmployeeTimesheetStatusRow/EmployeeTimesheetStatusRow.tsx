import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import EmployeeTimesheetStatusChip from '@/components/Shared/EmployeeTimesheetStatusChip/EmployeeTimesheetStatusChip';
import type { EmployeeTimesheetStatus } from '@/api/generated/models/EmployeeTimesheetStatus';
import '@/components/PayPeriodDashboard/EmployeeTimesheetStatusCard/EmployeeTimesheetStatusRow/EmployeeTimesheetStatusRow.css';

type Props = {
  employee: EmployeeTimesheetStatus;
  hasPayrollReportMismatch: boolean;
};

const EmployeeTimesheetStatusRow = ({ employee, hasPayrollReportMismatch }: Props) => {
  const employeeName = [employee.lastName, employee.firstName].filter(Boolean).join(', ').trim() || 'Unnamed employee';
  const timesheetUrl = employee.timesheetFileId ? `https://docs.google.com/spreadsheets/d/${employee.timesheetFileId}/edit` : null;
  const includeInPayroll = employee.includeInPayroll ?? true;

  return (
    <TableRow className="employee-timesheet-status-row">
      <TableCell>{employeeName}</TableCell>
      <TableCell align="center">
        {timesheetUrl ? (
          <Tooltip title="Open timesheet">
            <IconButton aria-label="Open timesheet" component="a" href={timesheetUrl} rel="noopener noreferrer" target="_blank" size="small">
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell align="center">{employee.totalHours === null || employee.totalHours === undefined ? '-' : employee.totalHours.toFixed(2)}</TableCell>
      <TableCell align="center">
        {employee.flatRateQuantity === null || employee.flatRateQuantity === undefined ? '-' : employee.flatRateQuantity.toFixed(2)}
      </TableCell>
      <TableCell align="center">{employee.status && <EmployeeTimesheetStatusChip status={employee.status} />}</TableCell>
      <TableCell align="center">
        {includeInPayroll ? <CheckCircleIcon fontSize="small" color="success" /> : <CancelIcon fontSize="small" color="warning" />}
      </TableCell>
      <TableCell align="center">
        {hasPayrollReportMismatch && (
          <Tooltip title="This employee's live timesheet totals no longer match the generated payroll report.">
            <WarningAmberIcon fontSize="small" color="warning" />
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
};

export default EmployeeTimesheetStatusRow;
