import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import DashboardList from '@/components/Shared/DashboardList/DashboardList';
import PayPeriodStatusChip from '@/components/Shared/PayPeriodStatusChip/PayPeriodStatusChip';
import type { PayPeriod } from '@/api/generated/models/PayPeriod';

type Props = {
  payPeriod: PayPeriod;
};

const PayPeriodInfoCard = ({ payPeriod }: Props) => {
  return (
    <DashboardCard id="pay-period-info-card" header="Pay Period Info" configPath={null}>
      <DashboardList
        items={[
          {
            key: 'name',
            labels: [payPeriod.payPeriodName ?? ''],
            startAdornment: payPeriod.status ? <PayPeriodStatusChip status={payPeriod.status} /> : null,
          },
        ]}
      />
    </DashboardCard>
  );
};

export default PayPeriodInfoCard;
