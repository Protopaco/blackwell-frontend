import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import EmployeeTimesheetStatusRow from '@/components/PayPeriodDashboard/EmployeeTimesheetStatusCard/EmployeeTimesheetStatusRow/EmployeeTimesheetStatusRow';
import hasPayrollReportMismatch from '@/components/PayPeriodDashboard/EmployeeTimesheetStatusCard/hasPayrollReportMismatch';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import TIMESHEET_STATUS_PROGRESSION from '@/models/timesheetStatusProgression';
import useTableSort from '@/hooks/useTableSort';
import type { EmployeeTimesheetStatus } from '@/api/generated/models/EmployeeTimesheetStatus';
import type { V1GetPayrollReport200ResponseValue } from '@/api/generated/models/V1GetPayrollReport200ResponseValue';

type Props = {
  employees: EmployeeTimesheetStatus[];
  payrollReport: { [employeeId: string]: V1GetPayrollReport200ResponseValue } | null;
};

type SortKey = 'name' | 'totalHours' | 'status' | 'includeInPayroll';

const sortableEmployeeName = (employee: EmployeeTimesheetStatus) => `${employee.lastName ?? ''}, ${employee.firstName ?? ''}`;

const EmployeeTimesheetStatusCard = ({ employees, payrollReport }: Props) => {
  const { sortedItems: sortedEmployees, sortableHeader } = useTableSort<EmployeeTimesheetStatus, SortKey>(
    employees,
    {
      name: (left, right) => sortableEmployeeName(left).localeCompare(sortableEmployeeName(right), undefined, { sensitivity: 'base' }),
      totalHours: (left, right) => (left.totalHours ?? 0) - (right.totalHours ?? 0),
      status: (left, right) => TIMESHEET_STATUS_PROGRESSION.indexOf(left.status!) - TIMESHEET_STATUS_PROGRESSION.indexOf(right.status!),
      includeInPayroll: (left, right) => Number(left.includeInPayroll ?? true) - Number(right.includeInPayroll ?? true),
    },
    'name',
  );

  return (
    <DashboardCard id="employee-timesheet-status-card" header="Employee Timesheet Status" configPath={null}>
      <ManagementTable
        headers={[
          sortableHeader('name', 'Name'),
          { label: 'Timesheet', align: 'center' },
          sortableHeader('totalHours', 'Total Hours', 'center'),
          sortableHeader('status', 'Status', 'center'),
          sortableHeader('includeInPayroll', 'Included', 'center'),
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
