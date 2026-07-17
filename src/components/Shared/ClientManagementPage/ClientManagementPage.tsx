import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useSelectedClient from '@/state/client/useSelectedClient';
import NavButton from '@/components/Shared/NavButton/NavButton';
import NavIcon from '@/models/NavIcon';

type Props = {
  title: string;
  children: ReactNode;
};

const ClientManagementPage = ({ title, children }: Props) => {
  const { selectedClient, clientsLoading } = useSelectedClient();

  if (clientsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedClient) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <NavButton label="Client Summary" path={`/client/${selectedClient.clientId}`} navIcon={NavIcon.Back} />
        </Box>
        <Box>
          <Typography variant="h4" component="h1">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedClient.clientName}
          </Typography>
        </Box>
        {children}
      </Stack>
    </Container>
  );
};

export default ClientManagementPage;
