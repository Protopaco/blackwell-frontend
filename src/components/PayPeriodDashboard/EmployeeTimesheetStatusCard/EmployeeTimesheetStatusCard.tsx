import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import EmployeeTimesheetStatusRow from '@/components/PayPeriodDashboard/EmployeeTimesheetStatusCard/EmployeeTimesheetStatusRow/EmployeeTimesheetStatusRow';
import type { EmployeeTimesheetStatus } from '@/api/generated/models/EmployeeTimesheetStatus';
import type { EmployeeExpense } from '@/api/generated/models/EmployeeExpense';

type Props = {
  employees: EmployeeTimesheetStatus[];
  employeeExpenses: EmployeeExpense[];
  onEmployeeExpenseUpdated: () => void;
};

const EmployeeTimesheetStatusCard = ({ employees, employeeExpenses, onEmployeeExpenseUpdated }: Props) => {
  const expensesByEmployeeId = new Map(employeeExpenses.map((expense) => [expense.employeeId, expense]));

  return (
    <DashboardCard id="employee-timesheet-status-card" header="Employee Timesheet Status" configPath={null}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Include/Ignore</TableCell>
              <TableCell>Total Expense</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => {
              const expense = expensesByEmployeeId.get(employee.employeeId);
              return (
                <EmployeeTimesheetStatusRow
                  key={employee.employeeId ?? employee.employeeName ?? ''}
                  employeeId={employee.employeeId ?? ''}
                  employeeName={employee.employeeName ?? ''}
                  status={employee.status}
                  activeThisPayPeriod={expense?.activeThisPayPeriod ?? true}
                  totalExpense={expense?.totalExpense ?? null}
                  onSaved={onEmployeeExpenseUpdated}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default EmployeeTimesheetStatusCard;
