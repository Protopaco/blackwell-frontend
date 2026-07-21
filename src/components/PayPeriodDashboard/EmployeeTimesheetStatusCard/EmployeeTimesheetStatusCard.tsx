import { useMemo, useState } from 'react';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import EmployeeTimesheetStatusRow from '@/components/PayPeriodDashboard/EmployeeTimesheetStatusCard/EmployeeTimesheetStatusRow/EmployeeTimesheetStatusRow';
import hasPayrollReportMismatch from '@/components/PayPeriodDashboard/EmployeeTimesheetStatusCard/hasPayrollReportMismatch';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import TIMESHEET_STATUS_PROGRESSION from '@/models/timesheetStatusProgression';
import type { EmployeeTimesheetStatus } from '@/api/generated/models/EmployeeTimesheetStatus';
import type { V1GetPayrollReport200ResponseValue } from '@/api/generated/models/V1GetPayrollReport200ResponseValue';

type Props = {
  employees: EmployeeTimesheetStatus[];
  payrollReport: { [employeeId: string]: V1GetPayrollReport200ResponseValue } | null;
};

type SortKey = 'name' | 'totalHours' | 'status' | 'includeInPayroll';

type SortDirection = 'asc' | 'desc';

const EmployeeTimesheetStatusCard = ({ employees, payrollReport }: Props) => {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedEmployees = useMemo(() => {
    return [...employees].sort((left, right) => {
      const directionMultiplier = sortDirection === 'asc' ? 1 : -1;
      const leftName = `${left.lastName ?? ''}, ${left.firstName ?? ''}`;
      const rightName = `${right.lastName ?? ''}, ${right.firstName ?? ''}`;

      switch (sortKey) {
        case 'totalHours':
          return directionMultiplier * ((left.totalHours ?? 0) - (right.totalHours ?? 0));
        case 'status':
          return (
            directionMultiplier *
            (TIMESHEET_STATUS_PROGRESSION.indexOf(left.status!) - TIMESHEET_STATUS_PROGRESSION.indexOf(right.status!))
          );
        case 'includeInPayroll':
          return directionMultiplier * (Number(left.includeInPayroll ?? true) - Number(right.includeInPayroll ?? true));
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
    <DashboardCard id="employee-timesheet-status-card" header="Employee Timesheet Status" configPath={null}>
      <ManagementTable
        headers={[
          { label: 'Name', sortDirection: sortKey === 'name' ? sortDirection : undefined, onSort: () => updateSort('name') },
          { label: 'Timesheet', align: 'center' },
          {
            label: 'Total Hours',
            align: 'center',
            sortDirection: sortKey === 'totalHours' ? sortDirection : undefined,
            onSort: () => updateSort('totalHours'),
          },
          { label: 'Status', align: 'center', sortDirection: sortKey === 'status' ? sortDirection : undefined, onSort: () => updateSort('status') },
          {
            label: 'Included',
            align: 'center',
            sortDirection: sortKey === 'includeInPayroll' ? sortDirection : undefined,
            onSort: () => updateSort('includeInPayroll'),
          },
          { label: 'Mismatch', align: 'center' },
        ]}
      >
        {sortedEmployees.map((employee) => (
          <EmployeeTimesheetStatusRow
            key={employee.employeeId ?? `${employee.lastName ?? ''}-${employee.firstName ?? ''}`}
            employee={employee}
            hasPayrollReportMismatch={hasPayrollReportMismatch(employee, payrollReport)}
          />
        ))}
      </ManagementTable>
    </DashboardCard>
  );
};

export default EmployeeTimesheetStatusCard;
