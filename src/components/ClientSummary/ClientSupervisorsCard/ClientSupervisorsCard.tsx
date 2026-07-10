import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import "@/components/ClientSummary/ClientSupervisorsCard/ClientSupervisorsCard.css";
import type { Supervisor } from "@/api/generated/models";

type Props = {
  supervisors: Supervisor[];
};

const ClientSupervisorsCard = ({ supervisors }: Props) => {
  return (
    <Card id="client-supervisors-card">
      <CardHeader title="Supervisors" />
      <CardContent>
        <List dense disablePadding>
          {supervisors.map((supervisor) => (
            <ListItem key={supervisor.supervisorId} disableGutters>
              <Typography variant="body2">
                {supervisor.supervisorFirstName} {supervisor.supervisorLastName}
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ClientSupervisorsCard;
