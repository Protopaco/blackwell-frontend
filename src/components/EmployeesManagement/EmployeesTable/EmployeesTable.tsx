import { useMemo, useState } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { Employee } from '@/api/generated/models/Employee';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import formatCurrency from '@/utils/formatCurrency';

type Props = {
  employees: Employee[];
};

type SortKey = 'name' | 'position' | 'email' | 'status' | 'payRates';

type SortDirection = 'asc' | 'desc';

const EmployeesTable = ({ employees }: Props) => {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedEmployees = useMemo(() => {
    return [...employees].sort((left, right) => {
      const directionMultiplier = sortDirection === 'asc' ? 1 : -1;
      const leftName = `${left.lastName ?? ''}, ${left.firstName ?? ''}`;
      const rightName = `${right.lastName ?? ''}, ${right.firstName ?? ''}`;

      switch (sortKey) {
        case 'position':
          return directionMultiplier * (left.position ?? '').localeCompare(right.position ?? '', undefined, { sensitivity: 'base' });
        case 'email':
          return directionMultiplier * (left.email ?? '').localeCompare(right.email ?? '', undefined, { sensitivity: 'base' });
        case 'status':
          return directionMultiplier * (left.status ?? '').localeCompare(right.status ?? '', undefined, { sensitivity: 'base' });
        case 'payRates':
          return directionMultiplier * ((left.hourlyPayRate1 ?? Number.POSITIVE_INFINITY) - (right.hourlyPayRate1 ?? Number.POSITIVE_INFINITY));
        case 'name':
        default:
          return directionMultiplier * leftName.localeCompare(rightName, undefined, { sensitivity: 'base' });
      }
    });
  }, [employees, sortDirection, sortKey]);

  const updateSort = (nextSortKey: SortKey) => {
    if (nextSortKey === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection('asc');
  };

  return (
    <ManagementTable
      headers={[
        { label: 'Name', sortDirection: sortKey === 'name' ? sortDirection : undefined, onSort: () => updateSort('name') },
        { label: 'Position', sortDirection: sortKey === 'position' ? sortDirection : undefined, onSort: () => updateSort('position') },
        { label: 'Email', sortDirection: sortKey === 'email' ? sortDirection : undefined, onSort: () => updateSort('email') },
        { label: 'Status', sortDirection: sortKey === 'status' ? sortDirection : undefined, onSort: () => updateSort('status') },
        { label: 'Pay Rates', sortDirection: sortKey === 'payRates' ? sortDirection : undefined, onSort: () => updateSort('payRates') },
        { label: 'Timesheet', align: 'right' },
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
                  Rate 1: {employee.hourlyPayRate1 === undefined ? 'Not set' : formatCurrency(employee.hourlyPayRate1)}
                </Typography>
                <Typography variant="body2">
                  Rate 2: {employee.hourlyPayRate2 === undefined ? 'Not set' : formatCurrency(employee.hourlyPayRate2)}
                </Typography>
                <Typography variant="body2">
                  Holiday: {employee.holidayPayRate === undefined ? 'Not set' : formatCurrency(employee.holidayPayRate)}
                </Typography>
              </Stack>
            </TableCell>
            <TableCell align="right">
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
