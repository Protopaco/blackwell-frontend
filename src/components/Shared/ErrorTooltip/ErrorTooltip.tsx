import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Tooltip from '@mui/material/Tooltip';
import '@/components/Shared/ErrorTooltip/ErrorTooltip.css';

type Props = {
  message: string;
};

const ErrorTooltip = ({ message }: Props) => {
  return (
    <Tooltip title={message}>
      <ErrorOutlineIcon color="error" fontSize="small" className="error-tooltip-icon" />
    </Tooltip>
  );
};

export default ErrorTooltip;
