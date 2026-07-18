import { useState } from 'react';
import { fundingSourceApi } from '@/api/client';
import type { FundingSource } from '@/api/generated/models/FundingSource';
import CreateFundingSourceDialog from '@/components/FundingSourcesManagement/CreateFundingSourceDialog/CreateFundingSourceDialog';
import EditFundingSourceDialog from '@/components/FundingSourcesManagement/EditFundingSourceDialog/EditFundingSourceDialog';
import FundingSourcesTable from '@/components/FundingSourcesManagement/FundingSourcesTable/FundingSourcesTable';
import ClientManagementPage from '@/components/Shared/ClientManagementPage/ClientManagementPage';
import ManagementListPanel from '@/components/Shared/ManagementListPanel/ManagementListPanel';
import ManagementToolbar from '@/components/Shared/ManagementToolbar/ManagementToolbar';
import useFetchByKey from '@/hooks/useFetchByKey';
import useSelectedClient from '@/state/client/useSelectedClient';

const FundingSourcesManagement = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingFundingSource, setEditingFundingSource] = useState<FundingSource | null>(null);
  const { selectedClient } = useSelectedClient();
  const clientId = selectedClient?.clientId;

  const {
    data: fundingSources,
    errorMessage,
    loading,
    refetch,
  } = useFetchByKey(clientId, (clientId) => fundingSourceApi.v1GetFundingSources({ clientId }), 'Failed to load funding sources.');

  const visibleFundingSources = fundingSources ?? [];

  return (
    <ClientManagementPage title="Funding Sources">
      <ManagementListPanel
        controls={<ManagementToolbar primaryActionLabel="Create" onPrimaryAction={() => setCreateDialogOpen(true)} />}
        empty={visibleFundingSources.length === 0}
        emptyMessage="No funding sources."
        errorMessage={errorMessage}
        loading={loading}
      >
        <FundingSourcesTable fundingSources={visibleFundingSources} onEdit={setEditingFundingSource} />
      </ManagementListPanel>
      {clientId ? (
        <CreateFundingSourceDialog clientId={clientId} open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} onCreated={refetch} />
      ) : null}
      {clientId ? (
        <EditFundingSourceDialog
          clientId={clientId}
          fundingSource={editingFundingSource}
          open={editingFundingSource !== null}
          onClose={() => setEditingFundingSource(null)}
          onSaved={refetch}
        />
      ) : null}
    </ClientManagementPage>
  );
};

export default FundingSourcesManagement;
