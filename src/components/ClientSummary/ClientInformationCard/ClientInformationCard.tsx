import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import "@/components/ClientSummary/ClientInformationCard/ClientInformationCard.css";

type Props = {
  clientName: string;
  clientCode: string;
};

const ClientInformationCard = ({ clientName, clientCode }: Props) => {
  return (
    <Card id="client-information-card">
      <CardHeader title="Client Information" />
      <CardContent>
        <Typography variant="h6">{clientName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {clientCode}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ClientInformationCard;
