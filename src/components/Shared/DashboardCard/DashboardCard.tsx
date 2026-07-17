import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import '@/components/Shared/DashboardCard/DashboardCard.css';

type Props = {
  id: string;
  header: string;
  configPath: string | null;
  children: ReactNode;
};

const DashboardCard = ({ id, header, configPath, children }: Props) => {
  const navigate = useNavigate();
  const clickable = configPath !== null;
  const navigateToConfig = () => {
    if (configPath) {
      navigate(configPath);
    }
  };

  return (
    <Card
      id={id}
      className={clickable ? 'dashboard-card dashboard-card-clickable' : 'dashboard-card'}
      onClick={clickable ? navigateToConfig : undefined}
      onKeyDown={
        clickable
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                navigateToConfig();
              }
            }
          : undefined
      }
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <Box className="dashboard-card-header-row">
        <Typography className="dashboard-card-header" variant="subtitle1" color="primary">
          {header}
        </Typography>
        {clickable && <SettingsOutlinedIcon className="dashboard-card-action-icon" fontSize="small" aria-hidden="true" />}
      </Box>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default DashboardCard;
