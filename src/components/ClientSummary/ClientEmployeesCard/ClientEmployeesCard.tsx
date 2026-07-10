import Typography from "@mui/material/Typography";
import DashboardCard from "@/components/Shared/DashboardCard/DashboardCard";
import { EmployeeStatusEnum, type Employee } from "@/api/generated/models/Employee";

type Props = {
  employees: Employee[];
};

const ClientEmployeesCard = ({ employees }: Props) => {
  const employeeCount = employees.filter((employee) => employee.status === EmployeeStatusEnum.Active).length;

  return (
    <DashboardCard id="client-employees-card" header="Employees" configPath={null}>
      <Typography variant="h6">{employeeCount} Active</Typography>
    </DashboardCard>
  );
};

export default ClientEmployeesCard;
