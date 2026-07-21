import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { Employee } from '@/api/generated/models/Employee';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import currencyToString from '@/utils/currencyToString';
import useTableSort from '@/hooks/useTableSort';

type Props = {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
};

type SortKey = 'name' | 'position' | 'email' | 'status' | 'payRates';

const sortableEmployeeName = (employee: Employee) => `${employee.lastName ?? ''}, ${employee.firstName ?? ''}`;

const EmployeesTable = ({ employees, onEdit }: Props) => {
  const { sortedItems: sortedEmployees, sortableHeader } = useTableSort<Employee, SortKey>(
    employees,
    {
      name: (left, right) => sortableEmployeeName(left).localeCompare(sortableEmployeeName(right), undefined, { sensitivity: 'base' }),
      position: (left, right) => (left.position ?? '').localeCompare(right.position ?? '', undefined, { sensitivity: 'base' }),
      email: (left, right) => (left.email ?? '').localeCompare(right.email ?? '', undefined, { sensitivity: 'base' }),
      status: (left, right) => (left.status ?? '').localeCompare(right.status ?? '', undefined, { sensitivity: 'base' }),
      payRates: (left, right) => (left.hourlyPayRate1 ?? Number.POSITIVE_INFINITY) - (right.hourlyPayRate1 ?? Number.POSITIVE_INFINITY),
    },
    'name',
  );

  return (
    <ManagementTable
      headers={[
        sortableHeader('name', 'Name'),
        sortableHeader('position', 'Position'),
        sortableHeader('email', 'Email'),
        sortableHeader('status', 'Status'),
        sortableHeader('payRates', 'Pay Rates'),
        { label: 'Actions', align: 'right' },
      ]}
    >
      {sortedEmployees.map((employee) => {
        const employeeName = [employee.lastName, employee.firstName].filter(Boolean).join(', ').trim() || 'Unnamed employee';
        const timesheetUrl = employee.timesheetFileId ? `https://docs.google.com/spreadsheets/d/${employee.timesheetFileId}/edit` : null;

        return (
          <TableRow key={employee.employeeId ?? employee.email ?? employeeName}>
            <TableCell>{employeeName}</TableCell>
            <TableCell>{employee.position}</TableCell>
            <TableCell>{employee.email}</TableCell>
            <TableCell>{employee.status}</TableCell>
            <TableCell>
              <Stack spacing={0.25}>
                <Typography variant="body2">
                  Rate 1: {employee.hourlyPayRate1 === undefined ? 'Not set' : currencyToString(employee.hourlyPayRate1, { decorated: true })}
                </Typography>
                <Typography variant="body2">
                  Rate 2: {employee.hourlyPayRate2 === undefined ? 'Not set' : currencyToString(employee.hourlyPayRate2, { decorated: true })}
                </Typography>
                <Typography variant="body2">
                  Holiday: {employee.holidayPayRate === undefined ? 'Not set' : currencyToString(employee.holidayPayRate, { decorated: true })}
                </Typography>
              </Stack>
            </TableCell>
            <TableCell align="right">
              <IconButton aria-label={`Edit ${employeeName}`} onClick={() => onEdit(employee)} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
              {timesheetUrl ? (
                <IconButton
                  aria-label={`Open ${employeeName} timesheet`}
                  component="a"
                  href={timesheetUrl}
                  rel="noreferrer"
                  target="_blank"
                  size="small"
                >
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              ) : null}
            </TableCell>
          </TableRow>
        );
      })}
    </ManagementTable>
  );
};

export default EmployeesTable;
