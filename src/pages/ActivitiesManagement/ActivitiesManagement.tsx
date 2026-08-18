import { useState } from 'react';
import Button from '@mui/material/Button';
import { activityApi, fundingSourceApi } from '@/api/client';
import type { Activity } from '@/api/generated/models/Activity';
import type { ActivityReorderUpdate } from '@/api/generated/models/ActivityReorderUpdate';
import ActivityDialog from '@/components/ActivitiesManagement/ActivityDialog/ActivityDialog';
import ActivitiesTable from '@/components/ActivitiesManagement/ActivitiesTable/ActivitiesTable';
import ClientManagementPage from '@/components/Shared/ClientManagementPage/ClientManagementPage';
import DeleteConfirmationDialog from '@/components/Shared/DeleteConfirmationDialog/DeleteConfirmationDialog';
import ManagementListPanel from '@/components/Shared/ManagementListPanel/ManagementListPanel';
import ManagementToolbar from '@/components/Shared/ManagementToolbar/ManagementToolbar';
import useAsyncAction from '@/hooks/useAsyncAction';
import useFetchByKey from '@/hooks/useFetchByKey';
import useSelectedClient from '@/state/client/useSelectedClient';
import { useToast } from '@/state/toast/toast.context';
import resolveErrorMessage from '@/utils/resolveErrorMessage';

const ActivitiesManagement = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
  // Local working copy of the reordered activity list — null means there's no unsaved reorder in
  // progress, so the table just shows what was fetched. Set by ActivitiesTable's onReorder, cleared on
  // Save All or whenever the underlying list changes structurally (create/edit/delete).
  const [pendingActivities, setPendingActivities] = useState<Activity[] | null>(null);
  const { selectedClient } = useSelectedClient();
  const clientId = selectedClient?.clientId;
  const { showToast } = useToast();

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
  const displayedActivities = pendingActivities ?? visibleActivities;
  const availableFundingSources = fundingSources ?? [];
  const pageLoading = loading || fundingSourcesLoading;

  const changedActivities = pendingActivities
    ? pendingActivities.filter((pendingActivity) => {
        const originalActivity = visibleActivities.find((activity) => activity.activityId === pendingActivity.activityId);
        return originalActivity && (originalActivity.sortOrder !== pendingActivity.sortOrder || originalActivity.groupLabel !== pendingActivity.groupLabel);
      })
    : [];

  const {
    run: saveReorder,
    loading: reorderSaving,
    errorMessage: reorderErrorMessage,
  } = useAsyncAction(async () => {
    const activityReorderUpdate: ActivityReorderUpdate[] = changedActivities.map((activity) => ({
      activityId: activity.activityId!,
      groupLabel: activity.groupLabel ?? null,
      sortOrder: activity.sortOrder!,
    }));

    await activityApi.v1UpdateActivitiesBatch({ clientId: clientId!, activityReorderUpdate });
    setPendingActivities(null);
    refetch();
  }, 'Failed to save activity order.', 'Activity order saved.');

  const pageErrorMessage = errorMessage ?? fundingSourcesErrorMessage ?? reorderErrorMessage;

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

  const closeDeleteDialog = () => {
    if (deleteSaving) return;

    setDeletingActivity(null);
    setDeleteErrorMessage(null);
  };

  const createActivity = async (activity: Activity) => {
    if (saving || !clientId) return;

    setSaving(true);
    setSaveErrorMessage(null);

    try {
      await activityApi.v1CreateActivity({ clientId, activity });
      setCreateDialogOpen(false);
      setPendingActivities(null);
      refetch();
      showToast('Activity created.', 'success');
    } catch (error) {
      console.error('Failed to create activity.', error);
      const message = await resolveErrorMessage(error, 'Failed to create activity.');
      setSaveErrorMessage(message);
      showToast(message, 'error');
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
      setPendingActivities(null);
      refetch();
      showToast('Activity updated.', 'success');
    } catch (error) {
      console.error('Failed to update activity.', error);
      const message = await resolveErrorMessage(error, 'Failed to update activity.');
      setSaveErrorMessage(message);
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteActivity = async () => {
    if (deleteSaving || !clientId || !deletingActivity?.activityId) return;

    setDeleteSaving(true);
    setDeleteErrorMessage(null);

    try {
      await activityApi.v1DeleteActivity({ clientId, activityId: deletingActivity.activityId });
      setDeletingActivity(null);
      setPendingActivities(null);
      refetch();
      showToast('Activity deleted.', 'success');
    } catch (error) {
      console.error('Failed to delete activity.', error);
      const message = await resolveErrorMessage(error, 'Failed to delete activity.');
      setDeleteErrorMessage(message);
      showToast(message, 'error');
    } finally {
      setDeleteSaving(false);
    }
  };

  return (
    <ClientManagementPage title="Activities">
      <ManagementListPanel
        controls={
          <ManagementToolbar primaryActionLabel="Create" onPrimaryAction={() => setCreateDialogOpen(true)} primaryActionDisabled={fundingSourcesLoading}>
            <Button variant="outlined" onClick={saveReorder} disabled={changedActivities.length === 0 || reorderSaving} loading={reorderSaving}>
              Save All
            </Button>
          </ManagementToolbar>
        }
        empty={visibleActivities.length === 0}
        emptyMessage="No activities."
        errorMessage={pageErrorMessage}
        loading={pageLoading}
      >
        <ActivitiesTable
          activities={displayedActivities}
          dragDisabled={reorderSaving}
          onDelete={setDeletingActivity}
          onEdit={setEditingActivity}
          onReorder={setPendingActivities}
        />
      </ManagementListPanel>
      {createDialogOpen && (
        <ActivityDialog
          activities={visibleActivities}
          activity={null}
          errorMessage={saveErrorMessage}
          fundingSources={availableFundingSources}
          formId="create-activity-form"
          onClose={closeCreateDialog}
          onSave={createActivity}
          saving={saving}
          submitLabel="Create"
          title="Create Activity"
        />
      )}
      {editingActivity && (
        <ActivityDialog
          activities={visibleActivities}
          activity={editingActivity}
          errorMessage={saveErrorMessage}
          fundingSources={availableFundingSources}
          formId="edit-activity-form"
          onClose={closeEditDialog}
          onSave={updateActivity}
          saving={saving}
          submitLabel="Save"
          title="Edit Activity"
        />
      )}
      <DeleteConfirmationDialog
        body="This removes the activity from client configuration and can affect generated timesheets, payroll, and allocation reporting."
        errorMessage={deleteErrorMessage}
        onClose={closeDeleteDialog}
        onConfirm={deleteActivity}
        open={deletingActivity !== null}
        saving={deleteSaving}
        title="Delete activity?"
      />
    </ClientManagementPage>
  );
};

export default ActivitiesManagement;
