import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import '@/components/PayPeriodDashboard/PayPeriodDashboardFooter/ReportFooterSection/ReportFooterSection.css';

type Props = {
  label: string;
  onGenerate: (() => void) | null;
  generateLoading?: boolean;
  onView: (() => void) | null;
  errorMessage?: string | null;
};

const ReportFooterSection = ({ label, onGenerate, generateLoading = false, onView, errorMessage = null }: Props) => {
  return (
    <Stack spacing={1} className="report-footer-section">
      <Typography variant="subtitle2">{label}</Typography>
      <Stack direction="row" spacing={1}>
        <Button variant="outlined" size="small" onClick={onGenerate ?? undefined} disabled={!onGenerate || generateLoading} loading={generateLoading}>
          Generate
        </Button>
        <Button variant="outlined" size="small" onClick={onView ?? undefined} disabled={!onView}>
          View
        </Button>
      </Stack>
      {errorMessage && (
        <Typography variant="body2" color="error">
          {errorMessage}
        </Typography>
      )}
    </Stack>
  );
};

export default ReportFooterSection;
