import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import EmployeeTimesheetStatusChip from '@/components/Shared/EmployeeTimesheetStatusChip/EmployeeTimesheetStatusChip';
import type { EmployeeTimesheetStatus } from '@/api/generated/models/EmployeeTimesheetStatus';

type Props = {
  employees: EmployeeTimesheetStatus[];
};

const EmployeeTimesheetStatusCard = ({ employees }: Props) => {
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
            {employees.map((employee) => (
              <TableRow key={employee.employeeId ?? employee.employeeName ?? ''}>
                <TableCell>{employee.employeeName}</TableCell>
                <TableCell>{employee.status && <EmployeeTimesheetStatusChip status={employee.status} />}</TableCell>
                <TableCell />
                <TableCell />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default EmployeeTimesheetStatusCard;
