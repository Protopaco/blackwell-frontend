import Typography from "@mui/material/Typography";
import DashboardCard from "@/components/Shared/DashboardCard/DashboardCard";
import type { Employee } from "@/api/generated/models/Employee";

type Props = {
  employees: Employee[];
};

const ClientEmployeesCard = ({ employees }: Props) => {
  return (
    <DashboardCard id="client-employees-card" header="Employees" configPath={null}>
      <Typography variant="h6">{employees.length} Active</Typography>
    </DashboardCard>
  );
};

export default ClientEmployeesCard;
