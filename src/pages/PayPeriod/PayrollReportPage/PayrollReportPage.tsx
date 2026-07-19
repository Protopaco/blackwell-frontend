import Typography from '@mui/material/Typography';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';

const PayrollReportPage = () => {
  return (
    <DashboardCard id="payroll-report-page" header="Payroll Report" configPath={null}>
      <Typography color="text.secondary">Payroll report details will appear here.</Typography>
    </DashboardCard>
  );
};

export default PayrollReportPage;
