import { useState } from 'react';
import { fundingSourceApi } from '@/api/client';
import type { FundingSource } from '@/api/generated/models/FundingSource';
import CreateFundingSourceDialog from '@/components/FundingSourcesManagement/CreateFundingSourceDialog/CreateFundingSourceDialog';
import EditFundingSourceDialog from '@/components/FundingSourcesManagement/EditFundingSourceDialog/EditFundingSourceDialog';
import FundingSourcesTable from '@/components/FundingSourcesManagement/FundingSourcesTable/FundingSourcesTable';
import ClientManagementPage from '@/components/Shared/ClientManagementPage/ClientManagementPage';
import DeleteConfirmationDialog from '@/components/Shared/DeleteConfirmationDialog/DeleteConfirmationDialog';
import ManagementListPanel from '@/components/Shared/ManagementListPanel/ManagementListPanel';
import ManagementToolbar from '@/components/Shared/ManagementToolbar/ManagementToolbar';
import useFetchByKey from '@/hooks/useFetchByKey';
import useSelectedClient from '@/state/client/useSelectedClient';
import { useToast } from '@/state/toast/toast.context';
import resolveErrorMessage from '@/utils/resolveErrorMessage';

const FundingSourcesManagement = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingFundingSource, setEditingFundingSource] = useState<FundingSource | null>(null);
  const [deletingFundingSource, setDeletingFundingSource] = useState<FundingSource | null>(null);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
  const { selectedClient } = useSelectedClient();
  const clientId = selectedClient?.clientId;
  const { showToast } = useToast();

  const {
    data: fundingSources,
    errorMessage,
    loading,
    refetch,
  } = useFetchByKey(clientId, (clientId) => fundingSourceApi.v1GetFundingSources({ clientId }), 'Failed to load funding sources.');

  const visibleFundingSources = fundingSources ?? [];

  const closeDeleteDialog = () => {
    if (deleteSaving) return;

    setDeletingFundingSource(null);
    setDeleteErrorMessage(null);
  };

  const deleteFundingSource = async () => {
    if (deleteSaving || !clientId || !deletingFundingSource?.fundingSourceId) return;

    setDeleteSaving(true);
    setDeleteErrorMessage(null);

    try {
      await fundingSourceApi.v1DeleteFundingSource({ clientId, fundingSourceId: deletingFundingSource.fundingSourceId });
      setDeletingFundingSource(null);
      refetch();
      showToast('Funding source deleted.', 'success');
    } catch (error) {
      console.error('Failed to delete funding source.', error);
      const message = await resolveErrorMessage(error, 'Failed to delete funding source.');
      setDeleteErrorMessage(message);
      showToast(message, 'error');
    } finally {
      setDeleteSaving(false);
    }
  };

  return (
    <ClientManagementPage title="Funding Sources">
      <ManagementListPanel
        controls={<ManagementToolbar primaryActionLabel="Create" onPrimaryAction={() => setCreateDialogOpen(true)} />}
        empty={visibleFundingSources.length === 0}
        emptyMessage="No funding sources."
        errorMessage={errorMessage}
        loading={loading}
      >
        <FundingSourcesTable fundingSources={visibleFundingSources} onDelete={setDeletingFundingSource} onEdit={setEditingFundingSource} />
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
      <DeleteConfirmationDialog
        body="This removes the funding source from client configuration and may affect activity allocation setup and reporting."
        errorMessage={deleteErrorMessage}
        onClose={closeDeleteDialog}
        onConfirm={deleteFundingSource}
        open={deletingFundingSource !== null}
        saving={deleteSaving}
        title="Delete funding source?"
      />
    </ClientManagementPage>
  );
};

export default FundingSourcesManagement;
