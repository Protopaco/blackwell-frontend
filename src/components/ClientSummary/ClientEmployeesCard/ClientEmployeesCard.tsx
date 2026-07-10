import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import "@/components/ClientSummary/ClientEmployeesCard/ClientEmployeesCard.css";
import { EmployeeStatusEnum, type Employee } from "@/api/generated/models/Employee";

type Props = {
    employees: Employee[];
};

const ClientEmployeesCard= ({ employees }: Props) => {
  const employeeCount = employees.filter((employee) => employee.status === EmployeeStatusEnum.Active).length;

  return (
    <Card id="client-employees-card">
      <CardHeader title="Employees" />
      <CardContent>
        <Typography variant="h6">{employeeCount} Active</Typography>
      </CardContent>
    </Card>
  );
};

export default ClientEmployeesCard;
