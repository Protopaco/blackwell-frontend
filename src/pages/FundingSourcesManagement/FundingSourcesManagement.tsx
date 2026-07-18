import { fundingSourceApi } from '@/api/client';
import FundingSourcesTable from '@/components/FundingSourcesManagement/FundingSourcesTable/FundingSourcesTable';
import ClientManagementPage from '@/components/Shared/ClientManagementPage/ClientManagementPage';
import ManagementListPanel from '@/components/Shared/ManagementListPanel/ManagementListPanel';
import useFetchByKey from '@/hooks/useFetchByKey';
import useSelectedClient from '@/state/client/useSelectedClient';

const FundingSourcesManagement = () => {
  const { selectedClient } = useSelectedClient();
  const clientId = selectedClient?.clientId;

  const {
    data: fundingSources,
    errorMessage,
    loading,
  } = useFetchByKey(clientId, (clientId) => fundingSourceApi.v1GetFundingSources({ clientId }), 'Failed to load funding sources.');

  const visibleFundingSources = fundingSources ?? [];

  return (
    <ClientManagementPage title="Funding Sources">
      <ManagementListPanel empty={visibleFundingSources.length === 0} emptyMessage="No funding sources." errorMessage={errorMessage} loading={loading}>
        <FundingSourcesTable fundingSources={visibleFundingSources} />
      </ManagementListPanel>
    </ClientManagementPage>
  );
};

export default FundingSourcesManagement;
