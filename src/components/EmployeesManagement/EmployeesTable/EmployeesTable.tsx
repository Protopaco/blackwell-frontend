import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import type { Employee } from '@/api/generated/models/Employee';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import useTableSort from '@/hooks/useTableSort';

type Props = {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
};

type SortKey = 'name' | 'position' | 'email' | 'status';

const sortableEmployeeName = (employee: Employee) => `${employee.lastName ?? ''}, ${employee.firstName ?? ''}`;

const EmployeesTable = ({ employees, onEdit }: Props) => {
  const { sortedItems: sortedEmployees, sortableHeader } = useTableSort<Employee, SortKey>(
    employees,
    {
      name: (left, right) => sortableEmployeeName(left).localeCompare(sortableEmployeeName(right), undefined, { sensitivity: 'base' }),
      position: (left, right) => (left.position ?? '').localeCompare(right.position ?? '', undefined, { sensitivity: 'base' }),
      email: (left, right) => (left.email ?? '').localeCompare(right.email ?? '', undefined, { sensitivity: 'base' }),
      status: (left, right) => (left.status ?? '').localeCompare(right.status ?? '', undefined, { sensitivity: 'base' }),
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
