import { useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { payPeriodApi } from '@/api/client';
import AddExistingEmployeeDialog from '@/components/PayPeriodDashboard/EmployeeTimesheetStatusCard/AddExistingEmployeeDialog/AddExistingEmployeeDialog';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import EmployeeTimesheetStatusRow from '@/components/PayPeriodDashboard/EmployeeTimesheetStatusCard/EmployeeTimesheetStatusRow/EmployeeTimesheetStatusRow';
import hasPayrollReportMismatch from '@/components/PayPeriodDashboard/EmployeeTimesheetStatusCard/hasPayrollReportMismatch';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import TIMESHEET_STATUS_PROGRESSION from '@/models/timesheetStatusProgression';
import useTablePagination from '@/hooks/useTablePagination';
import useTableSort from '@/hooks/useTableSort';
import useTextSearch from '@/hooks/useTextSearch';
import { useToast } from '@/state/toast/toast.context';
import resolveErrorMessage from '@/utils/resolveErrorMessage';
import type { EmployeeTimesheetStatus } from '@/api/generated/models/EmployeeTimesheetStatus';
import type { V1GetPayrollReport200ResponseValue } from '@/api/generated/models/V1GetPayrollReport200ResponseValue';

type Props = {
  clientId: string;
  payPeriodId: string;
  employees: EmployeeTimesheetStatus[];
  payrollReport: { [employeeId: string]: V1GetPayrollReport200ResponseValue } | null;
  onEmployeesChanged: () => void;
};

type SortKey = 'name' | 'totalHours' | 'flatRate' | 'status' | 'includeInPayroll' | 'mismatch';

type CompletionFilter = 'all' | 'incomplete' | 'complete';

const sortableEmployeeName = (employee: EmployeeTimesheetStatus) => `${employee.lastName ?? ''}, ${employee.firstName ?? ''}`;

const matchesCompletionFilter = (employee: EmployeeTimesheetStatus, filter: CompletionFilter): boolean => {
  if (filter === 'all') return true;
  const isComplete = employee.status === 'Complete';
  return filter === 'complete' ? isComplete : !isComplete;
};

const EmployeeTimesheetStatusCard = ({ clientId, payPeriodId, employees, payrollReport, onEmployeesChanged }: Props) => {
  const { showToast } = useToast();
  const [removingEmployeeId, setRemovingEmployeeId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleRemove = async (employeeId: string) => {
    setRemovingEmployeeId(employeeId);
    try {
      await payPeriodApi.v1RemoveEmployeeFromPayPeriod({ clientId, payPeriodId, employeeId });
      showToast('Employee removed from pay period.', 'success');
      onEmployeesChanged();
    } catch (error) {
      const message = await resolveErrorMessage(error, 'Failed to remove employee from pay period.');
      showToast(message, 'error');
    } finally {
      setRemovingEmployeeId(null);
    }
  };

  const { searchTerm, setSearchTerm, filteredItems: searchedEmployees } = useTextSearch(employees, (employee) => [
    sortableEmployeeName(employee),
  ]);

  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>('all');
  const completionFilteredEmployees = searchedEmployees.filter((employee) => matchesCompletionFilter(employee, completionFilter));

  const { sortedItems: sortedEmployees, sortableHeader } = useTableSort<EmployeeTimesheetStatus, SortKey>(
    completionFilteredEmployees,
    {
      name: (left, right) => sortableEmployeeName(left).localeCompare(sortableEmployeeName(right), undefined, { sensitivity: 'base' }),
      totalHours: (left, right) => (left.totalHours ?? 0) - (right.totalHours ?? 0),
      flatRate: (left, right) => (left.flatRateQuantity ?? 0) - (right.flatRateQuantity ?? 0),
      status: (left, right) => TIMESHEET_STATUS_PROGRESSION.indexOf(left.status!) - TIMESHEET_STATUS_PROGRESSION.indexOf(right.status!),
      includeInPayroll: (left, right) => Number(left.includeInPayroll ?? true) - Number(right.includeInPayroll ?? true),
      mismatch: (left, right) =>
        Number(hasPayrollReportMismatch(left, payrollReport)) - Number(hasPayrollReportMismatch(right, payrollReport)),
    },
    'name',
  );

  const { pageItems: pagedEmployees, paginationProps } = useTablePagination(sortedEmployees);

  return (
    <DashboardCard id="employee-timesheet-status-card" header="Employee Timesheet Status" configPath={null}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            label="Search by name"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <ButtonGroup size="small">
            <Button variant={completionFilter === 'all' ? 'contained' : 'outlined'} onClick={() => setCompletionFilter('all')}>
              All
            </Button>
            <Button
              variant={completionFilter === 'incomplete' ? 'contained' : 'outlined'}
              onClick={() => setCompletionFilter('incomplete')}
            >
              Incomplete
            </Button>
            <Button
              variant={completionFilter === 'complete' ? 'contained' : 'outlined'}
              onClick={() => setCompletionFilter('complete')}
            >
              Complete
            </Button>
          </ButtonGroup>
        </Stack>
        <Button variant="contained" onClick={() => setAddDialogOpen(true)}>
          Add Employee
        </Button>
      </Stack>
      <ManagementTable
        headers={[
          sortableHeader('name', 'Name'),
          { label: 'Timesheet', align: 'center' },
          sortableHeader('totalHours', 'Total Hours', 'center'),
          sortableHeader('flatRate', 'Flat Rate', 'center'),
          sortableHeader('status', 'Status', 'center'),
          sortableHeader('includeInPayroll', 'Included', 'center'),
          sortableHeader('mismatch', 'Mismatch', 'center'),
          { label: 'Remove', align: 'center' },
        ]}
        pagination={paginationProps}
      >
        {pagedEmployees.map((employee) => (
          <EmployeeTimesheetStatusRow
            key={employee.employeeId ?? `${employee.lastName ?? ''}-${employee.firstName ?? ''}`}
            employee={employee}
            hasPayrollReportMismatch={hasPayrollReportMismatch(employee, payrollReport)}
            onRemove={() => handleRemove(employee.employeeId!)}
            removing={removingEmployeeId === employee.employeeId}
          />
        ))}
      </ManagementTable>
      <AddExistingEmployeeDialog
        clientId={clientId}
        payPeriodId={payPeriodId}
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        currentEmployeeIds={employees.map((employee) => employee.employeeId!)}
        onAdded={onEmployeesChanged}
      />
    </DashboardCard>
  );
};

export default EmployeeTimesheetStatusCard;
