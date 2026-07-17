import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { payrollReportApi } from '@/api/client';
import useAsyncAction from '@/hooks/useAsyncAction';
import ReportFooterSection from '@/components/PayPeriodDashboard/PayPeriodDashboardFooter/ReportFooterSection/ReportFooterSection';
import '@/components/PayPeriodDashboard/PayPeriodDashboardFooter/PayPeriodDashboardFooter.css';

type Props = {
  onPayrollReportGenerated: () => void;
};

const PayPeriodDashboardFooter = ({ onPayrollReportGenerated }: Props) => {
  const { clientId, payPeriodId } = useParams<{ clientId: string; payPeriodId: string }>();

  const {
    run: generatePayrollReport,
    loading: generatingPayrollReport,
    errorMessage: payrollReportErrorMessage,
  } = useAsyncAction(async () => {
    await payrollReportApi.v1GeneratePayrollReport({ clientId: clientId!, payPeriodId: payPeriodId! });
    onPayrollReportGenerated();
  }, 'Failed to generate payroll report.');

  return (
    <Paper square elevation={3} id="pay-period-dashboard-footer">
      <Container>
        <Stack direction="row" spacing={10} justifyContent="center">
          <ReportFooterSection
            label="Payroll Report"
            onGenerate={generatePayrollReport}
            generateLoading={generatingPayrollReport}
            onView={null}
            errorMessage={payrollReportErrorMessage}
          />
          <ReportFooterSection label="Allocation Report" onGenerate={null} onView={null} />
        </Stack>
      </Container>
    </Paper>
  );
};

export default PayPeriodDashboardFooter;
