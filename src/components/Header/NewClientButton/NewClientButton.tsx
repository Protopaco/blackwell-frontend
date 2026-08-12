import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import '@/components/Header/NewClientButton/NewClientButton.css';

const NewClientButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname !== '/') return null;

  return (
    <Button color="inherit" variant="outlined" id="new-client-button" startIcon={<AddIcon />} onClick={() => navigate('/client/new')}>
      New Client
    </Button>
  );
};

export default NewClientButton;
