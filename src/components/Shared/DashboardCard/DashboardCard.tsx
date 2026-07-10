import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "@/components/Shared/DashboardCard/DashboardCard.css";

type Props = {
  id: string;
  header: string;
  configPath: string | null;
  children: ReactNode;
};

const DashboardCard = ({ id, header, configPath, children }: Props) => {
  const navigate = useNavigate();
  const clickable = configPath !== null;

  return (
    <Card id={id} onClick={clickable ? () => navigate(configPath) : undefined} sx={clickable ? { cursor: "pointer" } : undefined}>
      <Typography className="dashboard-card-header" variant="subtitle1" color="primary">
        {header}
      </Typography>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default DashboardCard;
