import Typography from "@mui/material/Typography";
import DashboardCard from "@/components/Shared/DashboardCard/DashboardCard";

type Props = {
  clientName: string;
  clientCode: string;
};

const ClientInformationCard = ({ clientName, clientCode }: Props) => {
  return (
    <DashboardCard id="client-information-card" header="Client Information" configPath={null}>
      <Typography variant="h6">{clientName}</Typography>
      <Typography variant="body2" color="text.secondary">
        {clientCode}
      </Typography>
    </DashboardCard>
  );
};

export default ClientInformationCard;
