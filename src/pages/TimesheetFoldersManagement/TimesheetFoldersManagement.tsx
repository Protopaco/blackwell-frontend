import { useState } from 'react';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { timesheetFolderApi } from '@/api/client';
import { TimesheetFolderStatusEnum } from '@/api/generated/models/TimesheetFolder';
import type { TimesheetFolder } from '@/api/generated/models/TimesheetFolder';
import ClientManagementPage from '@/components/Shared/ClientManagementPage/ClientManagementPage';
import ManagementListPanel from '@/components/Shared/ManagementListPanel/ManagementListPanel';
import ManagementToolbar from '@/components/Shared/ManagementToolbar/ManagementToolbar';
import CreateTimesheetFolderDialog from '@/components/TimesheetFoldersManagement/CreateTimesheetFolderDialog/CreateTimesheetFolderDialog';
import EditTimesheetFolderDialog from '@/components/TimesheetFoldersManagement/EditTimesheetFolderDialog/EditTimesheetFolderDialog';
import TimesheetFoldersTable from '@/components/TimesheetFoldersManagement/TimesheetFoldersTable/TimesheetFoldersTable';
import useFetchByKey from '@/hooks/useFetchByKey';
import useSelectedClient from '@/state/client/useSelectedClient';

const TimesheetFoldersManagement = () => {
  const [showInactive, setShowInactive] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTimesheetFolder, setEditingTimesheetFolder] = useState<TimesheetFolder | null>(null);
  const { selectedClient } = useSelectedClient();
  const clientId = selectedClient?.clientId;

  const {
    data: timesheetFolders,
    errorMessage,
    loading,
    refetch,
  } = useFetchByKey(clientId, (clientId) => timesheetFolderApi.v1GetTimesheetFolders({ clientId }), 'Failed to load timesheet folders.');

  const visibleTimesheetFolders =
    timesheetFolders?.filter((timesheetFolder) => showInactive || timesheetFolder.status === TimesheetFolderStatusEnum.Active) ?? [];

  return (
    <ClientManagementPage title="Timesheet Folders">
      <ManagementListPanel
        controls={
          <ManagementToolbar primaryActionLabel="Create" onPrimaryAction={() => setCreateDialogOpen(true)}>
            <Switch checked={showInactive} onChange={(event) => setShowInactive(event.target.checked)} size="small" />
            <Typography>Show inactive</Typography>
          </ManagementToolbar>
        }
        empty={visibleTimesheetFolders.length === 0}
        emptyMessage={showInactive ? 'No timesheet folders.' : 'No active timesheet folders.'}
        errorMessage={errorMessage}
        loading={loading}
      >
        <TimesheetFoldersTable timesheetFolders={visibleTimesheetFolders} onEdit={setEditingTimesheetFolder} />
      </ManagementListPanel>
      {clientId ? (
        <CreateTimesheetFolderDialog clientId={clientId} open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} onCreated={refetch} />
      ) : null}
      {clientId ? (
        <EditTimesheetFolderDialog
          clientId={clientId}
          open={editingTimesheetFolder !== null}
          timesheetFolder={editingTimesheetFolder}
          onClose={() => setEditingTimesheetFolder(null)}
          onSaved={refetch}
        />
      ) : null}
    </ClientManagementPage>
  );
};

export default TimesheetFoldersManagement;
