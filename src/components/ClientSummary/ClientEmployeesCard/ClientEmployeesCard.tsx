import Typography from '@mui/material/Typography';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import type { Employee } from '@/api/generated/models/Employee';

type Props = {
  clientId: string;
  employees: Employee[];
};

const ClientEmployeesCard = ({ clientId, employees }: Props) => {
  return (
    <DashboardCard id="client-employees-card" header="Employees" configPath={`/client/${clientId}/employees`}>
      <Typography variant="h6">{employees.length} Active</Typography>
    </DashboardCard>
  );
};

export default ClientEmployeesCard;
