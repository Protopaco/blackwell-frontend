import { useState } from 'react';
import { activityApi, fundingSourceApi } from '@/api/client';
import type { Activity } from '@/api/generated/models/Activity';
import ActivityDialog from '@/components/ActivitiesManagement/ActivityDialog/ActivityDialog';
import ActivitiesTable from '@/components/ActivitiesManagement/ActivitiesTable/ActivitiesTable';
import ClientManagementPage from '@/components/Shared/ClientManagementPage/ClientManagementPage';
import ManagementListPanel from '@/components/Shared/ManagementListPanel/ManagementListPanel';
import ManagementToolbar from '@/components/Shared/ManagementToolbar/ManagementToolbar';
import useFetchByKey from '@/hooks/useFetchByKey';
import useSelectedClient from '@/state/client/useSelectedClient';
import resolveErrorMessage from '@/utils/resolveErrorMessage';

const ActivitiesManagement = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const { selectedClient } = useSelectedClient();
  const clientId = selectedClient?.clientId;

  const {
    data: activities,
    errorMessage,
    loading,
    refetch,
  } = useFetchByKey(clientId, (clientId) => activityApi.v1GetActivities({ clientId }), 'Failed to load activities.');
  const {
    data: fundingSources,
    errorMessage: fundingSourcesErrorMessage,
    loading: fundingSourcesLoading,
  } = useFetchByKey(clientId, (clientId) => fundingSourceApi.v1GetFundingSources({ clientId }), 'Failed to load funding sources.');

  const visibleActivities = activities ?? [];
  const availableFundingSources = fundingSources ?? [];
  const pageErrorMessage = errorMessage ?? fundingSourcesErrorMessage;
  const pageLoading = loading || fundingSourcesLoading;

  const closeCreateDialog = () => {
    if (saving) return;

    setCreateDialogOpen(false);
    setSaveErrorMessage(null);
  };

  const closeEditDialog = () => {
    if (saving) return;

    setEditingActivity(null);
    setSaveErrorMessage(null);
  };

  const createActivity = async (activity: Activity) => {
    if (saving || !clientId) return;

    setSaving(true);
    setSaveErrorMessage(null);

    try {
      await activityApi.v1CreateActivity({ clientId, activity });
      setCreateDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Failed to create activity.', error);
      setSaveErrorMessage(await resolveErrorMessage(error, 'Failed to create activity.'));
    } finally {
      setSaving(false);
    }
  };

  const updateActivity = async (activity: Activity) => {
    if (saving || !clientId || !editingActivity?.activityId) return;

    setSaving(true);
    setSaveErrorMessage(null);

    try {
      await activityApi.v1UpdateActivity({ clientId, activityId: editingActivity.activityId, activity });
      setEditingActivity(null);
      refetch();
    } catch (error) {
      console.error('Failed to update activity.', error);
      setSaveErrorMessage(await resolveErrorMessage(error, 'Failed to update activity.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ClientManagementPage title="Activities">
      <ManagementListPanel
        controls={<ManagementToolbar primaryActionLabel="Create" onPrimaryAction={() => setCreateDialogOpen(true)} primaryActionDisabled={fundingSourcesLoading} />}
        empty={visibleActivities.length === 0}
        emptyMessage="No activities."
        errorMessage={pageErrorMessage}
        loading={pageLoading}
      >
        <ActivitiesTable activities={visibleActivities} onEdit={setEditingActivity} />
      </ManagementListPanel>
      <ActivityDialog
        activity={null}
        errorMessage={saveErrorMessage}
        fundingSources={availableFundingSources}
        formId="create-activity-form"
        onClose={closeCreateDialog}
        onSave={createActivity}
        open={createDialogOpen}
        saving={saving}
        submitLabel="Create"
        title="Create Activity"
      />
      <ActivityDialog
        activity={editingActivity}
        errorMessage={saveErrorMessage}
        fundingSources={availableFundingSources}
        formId="edit-activity-form"
        onClose={closeEditDialog}
        onSave={updateActivity}
        open={editingActivity !== null}
        saving={saving}
        submitLabel="Save"
        title="Edit Activity"
      />
    </ClientManagementPage>
  );
};

export default ActivitiesManagement;
