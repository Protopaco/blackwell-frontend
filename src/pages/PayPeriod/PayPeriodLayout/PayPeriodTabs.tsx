import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import allocationReportGenerated from '@/models/allocationReportGenerated';
import payrollReportGenerated from '@/models/payrollReportGenerated';
import type { PayPeriodStatusEnum } from '@/api/generated/models/PayPeriod';

type Props = {
  basePath: string;
  payPeriodId: string;
  payPeriodStatus: PayPeriodStatusEnum | undefined;
};

const PayPeriodTabs = ({ basePath, payPeriodId, payPeriodStatus }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const lastSegment = location.pathname.split('/').pop();
  const tabValue = lastSegment === payPeriodId ? 'employees' : lastSegment;

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={tabValue}
        onChange={(_, nextValue: string) => {
          navigate(nextValue === 'employees' ? basePath : `${basePath}/${nextValue}`);
        }}
      >
        <Tab label="Employees" value="employees" />
        <Tab label="Funding Sources" value="fundingSources" />
        <Tab label="Activities" value="activities" />
        <Tab label="Payroll Report" value="payrollReport" disabled={!payrollReportGenerated(payPeriodStatus)} />
        <Tab label="Allocation Report" value="allocationReport" disabled={!allocationReportGenerated(payPeriodStatus)} />
      </Tabs>
    </Box>
  );
};

export default PayPeriodTabs;
