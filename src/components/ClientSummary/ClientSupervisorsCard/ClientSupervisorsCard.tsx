import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import type { Supervisor } from '@/api/generated/models';

type Props = {
  supervisors: Supervisor[];
};

const ClientSupervisorsCard = ({ supervisors }: Props) => {
  return (
    <DashboardCard id="client-supervisors-card" header="Supervisors" configPath={null}>
      <List dense disablePadding>
        {supervisors.map((supervisor) => (
          <ListItem key={supervisor.supervisorId} disableGutters>
            <Typography variant="body2">
              {supervisor.firstName} {supervisor.lastName}
            </Typography>
          </ListItem>
        ))}
      </List>
    </DashboardCard>
  );
};

export default ClientSupervisorsCard;
