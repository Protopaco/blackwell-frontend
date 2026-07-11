import { useParams } from 'react-router-dom';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import DashboardList from '@/components/Shared/DashboardList/DashboardList';
import PayPeriodStatusChip from '@/components/Shared/PayPeriodStatusChip/PayPeriodStatusChip';
import type { PayPeriod } from '@/api/generated/models/PayPeriod';

type Props = {
  payPeriods: PayPeriod[];
};

const ClientPayPeriodCard = ({ payPeriods }: Props) => {
  const { clientId } = useParams<{ clientId: string }>();

  return (
    <DashboardCard id="client-pay-period-card" header="Pay Periods" configPath={null}>
      <DashboardList
        items={payPeriods.map((payPeriod) => ({
          key: payPeriod.payPeriodId ?? '',
          labels: [payPeriod.payPeriodName ?? ''],
          endAdornment: payPeriod.status ? <PayPeriodStatusChip status={payPeriod.status} /> : null,
          path: payPeriod.payPeriodId ? `/client/${clientId}/payPeriod/${payPeriod.payPeriodId}` : null,
        }))}
      />
    </DashboardCard>
  );
};

export default ClientPayPeriodCard;
