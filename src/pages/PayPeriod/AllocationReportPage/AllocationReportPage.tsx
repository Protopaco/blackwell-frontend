import { useMemo } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { payrollReportApi } from '@/api/client';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import AllocationReportTable from '@/components/PayPeriod/AllocationReportTable/AllocationReportTable';
import type { AllocationReportRow } from '@/api/generated/models/AllocationReportRow';
import useFetchByKey from '@/hooks/useFetchByKey';
import type { PayPeriodLayoutContext } from '@/pages/PayPeriod/PayPeriodLayout/PayPeriodLayout';

const AllocationReportPage = () => {
  const { clientId, payPeriodId } = useParams<{ clientId: string; payPeriodId: string }>();
  const { payPeriod } = useOutletContext<PayPeriodLayoutContext>();
  // Includes payPeriod.status so this re-fetches the moment allocation report existence changes.
  const key = clientId && payPeriodId ? `${clientId}/${payPeriodId}/${payPeriod.status}` : undefined;

  const {
    data: allocationReport,
    errorMessage,
    loading,
  } = useFetchByKey(
    key,
    () => payrollReportApi.v1GetAllocationReport({ clientId: clientId!, payPeriodId: payPeriodId! }),
    'Failed to load allocation report.'
  );

  const rows = useMemo((): AllocationReportRow[] => {
    if (!allocationReport) return [];

    return [...allocationReport].sort((left, right) =>
      (left.fundingSourceName ?? '').localeCompare(right.fundingSourceName ?? '', undefined, { sensitivity: 'base' })
    );
  }, [allocationReport]);

  const renderBody = () => {
    if (errorMessage) {
      return <Typography color="error">{errorMessage}</Typography>;
    }

    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (rows.length === 0) {
      return <Typography color="text.secondary">No allocation report has been generated for this pay period.</Typography>;
    }

    return <AllocationReportTable rows={rows} />;
  };

  return (
    <DashboardCard id="allocation-report-page" header="Allocation Report" configPath={null}>
      {renderBody()}
    </DashboardCard>
  );
};

export default AllocationReportPage;
