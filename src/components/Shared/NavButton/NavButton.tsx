import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Button from '@mui/material/Button';
import NavIcon from '@/models/NavIcon';

type NavIconType = (typeof NavIcon)[keyof typeof NavIcon];

type Props = {
  label: string;
  path: string;
  navIcon?: NavIconType | null;
};

const NavButton = ({ label, path, navIcon = NavIcon.Back }: Props) => {
  const navigate = useNavigate();

  return (
    <Button
      startIcon={navIcon === NavIcon.Back ? <ArrowBackIcon /> : undefined}
      endIcon={navIcon === NavIcon.Forward ? <ArrowForwardIcon /> : undefined}
      variant="outlined"
      onClick={() => navigate(path)}
    >
      {label}
    </Button>
  );
};

export default NavButton;
