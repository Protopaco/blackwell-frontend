import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import DashboardList from '@/components/Shared/DashboardList/DashboardList';
import type { DashboardListItem } from '@/components/Shared/DashboardList/DashboardList';
import type { Employee } from '@/api/generated/models/Employee';

const EMPLOYEE_LIST_CAP = 10;

type Props = {
  clientId: string;
  employees: Employee[];
};

const employeeName = (employee: Employee) => `${employee.lastName ?? ''}, ${employee.firstName ?? ''}`;

const ClientEmployeesCard = ({ clientId, employees }: Props) => {
  const sortedEmployees = [...employees].sort((left, right) =>
    employeeName(left).localeCompare(employeeName(right), undefined, { sensitivity: 'base' }),
  );

  const items: DashboardListItem[] = sortedEmployees.slice(0, EMPLOYEE_LIST_CAP).map((employee) => ({
    key: employee.employeeId ?? employeeName(employee),
    labels: [employeeName(employee)],
  }));

  if (sortedEmployees.length > EMPLOYEE_LIST_CAP) {
    items.push({ key: 'employees-truncated', labels: ['…'] });
  }

  return (
    <DashboardCard id="client-employees-card" header="Employees" configPath={`/client/${clientId}/employees`}>
      <DashboardList items={items} />
    </DashboardCard>
  );
};

export default ClientEmployeesCard;
