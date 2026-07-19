import Typography from '@mui/material/Typography';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';

const AllocationReportPage = () => {
  return (
    <DashboardCard id="allocation-report-page" header="Allocation Report" configPath={null}>
      <Typography color="text.secondary">Allocation report details will appear here.</Typography>
    </DashboardCard>
  );
};

export default AllocationReportPage;
