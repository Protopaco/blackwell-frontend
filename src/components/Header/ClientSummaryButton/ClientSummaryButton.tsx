import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import useSelectedClient from '@/state/client/useSelectedClient';
import '@/components/Header/ClientSummaryButton/ClientSummaryButton.css';

const ClientSummaryButton = () => {
  const navigate = useNavigate();
  const { selectedClient } = useSelectedClient();

  if (!selectedClient) return null;

  return (
    <Button color="inherit" id="client-summary-button" onClick={() => navigate(`/client/${selectedClient.clientId}`)}>
      Client Summary
    </Button>
  );
};

export default ClientSummaryButton;
