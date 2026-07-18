import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import DashboardList from '@/components/Shared/DashboardList/DashboardList';
import type { FundingSource } from '@/api/generated/models/FundingSource';

type Props = {
  clientId: string;
  fundingSources: FundingSource[];
};

const ClientFundingSourcesCard = ({ clientId, fundingSources }: Props) => {
  return (
    <DashboardCard id="client-funding-sources-card" header="Funding Sources" configPath={`/client/${clientId}/fundingSources`}>
      <DashboardList
        items={fundingSources.map((fundingSource) => ({
          key: fundingSource.fundingSourceId ?? fundingSource.fundingSourceName ?? '',
          labels: [fundingSource.fundingSourceName ?? ''],
        }))}
      />
    </DashboardCard>
  );
};

export default ClientFundingSourcesCard;
