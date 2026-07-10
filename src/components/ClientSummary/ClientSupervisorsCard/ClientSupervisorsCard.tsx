import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import "@/components/ClientSummary/ClientSupervisorsCard/ClientSupervisorsCard.css";
import type { Supervisor } from "@/api/generated/models";

type Props = {
supervisors: Supervisor[];
};

const ClientSupervisorsCard= ({ supervisors }: Props) => {
  const supervisorCount = supervisors.length;

  return (
    <Card id="client-supervisors-card">
      <CardHeader title="Supervisors" />
      <CardContent>
        <Typography variant="h6">{supervisorCount} Active</Typography>
      </CardContent>
    </Card>
  );
};

export default ClientSupervisorsCard;
