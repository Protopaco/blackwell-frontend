import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import EmployeeTimesheetStatusChip from '@/components/Shared/EmployeeTimesheetStatusChip/EmployeeTimesheetStatusChip';
import type { EmployeeTimesheetStatus } from '@/api/generated/models/EmployeeTimesheetStatus';
import '@/components/PayPeriodDashboard/EmployeeTimesheetStatusCard/EmployeeTimesheetStatusRow/EmployeeTimesheetStatusRow.css';

type Props = {
  employee: EmployeeTimesheetStatus;
};

const EmployeeTimesheetStatusRow = ({ employee }: Props) => {
  const employeeName = employee.employeeName ?? '';
  const timesheetUrl = employee.timesheetFileId ? `https://docs.google.com/spreadsheets/d/${employee.timesheetFileId}/edit` : null;
  const includeInPayroll = employee.includeInPayroll ?? true;

  return (
    <TableRow className="employee-timesheet-status-row">
      <TableCell>{employeeName}</TableCell>
      <TableCell>
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
      <TableCell>{employee.totalHours === null || employee.totalHours === undefined ? '-' : employee.totalHours.toFixed(2)}</TableCell>
      <TableCell>{employee.status && <EmployeeTimesheetStatusChip status={employee.status} />}</TableCell>
      <TableCell>
        <Stack direction="row" spacing={0.5} alignItems="center">
          {includeInPayroll ? (
            <CheckCircleIcon fontSize="small" color="success" />
          ) : (
            <CancelIcon fontSize="small" color="warning" />
          )}
          <Typography variant="body2">{includeInPayroll ? 'Included' : 'Excluded'}</Typography>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default EmployeeTimesheetStatusRow;
