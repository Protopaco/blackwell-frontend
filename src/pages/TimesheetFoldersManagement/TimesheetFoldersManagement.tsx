import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { timesheetFolderApi } from '@/api/client';
import { TimesheetFolderStatusEnum } from '@/api/generated/models/TimesheetFolder';
import ClientManagementPage from '@/components/Shared/ClientManagementPage/ClientManagementPage';
import ManagementListPanel from '@/components/Shared/ManagementListPanel/ManagementListPanel';
import TimesheetFoldersTable from '@/components/TimesheetFoldersManagement/TimesheetFoldersTable/TimesheetFoldersTable';
import useFetchByKey from '@/hooks/useFetchByKey';
import useSelectedClient from '@/state/client/useSelectedClient';

const TimesheetFoldersManagement = () => {
  const [showInactive, setShowInactive] = useState(false);
  const { selectedClient } = useSelectedClient();
  const clientId = selectedClient?.clientId;

  const {
    data: timesheetFolders,
    errorMessage,
    loading,
  } = useFetchByKey(clientId, (clientId) => timesheetFolderApi.v1GetTimesheetFolders({ clientId }), 'Failed to load timesheet folders.');

  const visibleTimesheetFolders =
    timesheetFolders?.filter((timesheetFolder) => showInactive || timesheetFolder.status === TimesheetFolderStatusEnum.Active) ?? [];

  return (
    <ClientManagementPage title="Timesheet Folders">
      <ManagementListPanel
        controls={
          <Stack direction="row" spacing={1} alignItems="center">
            <Switch checked={showInactive} onChange={(event) => setShowInactive(event.target.checked)} size="small" />
            <Typography>Show inactive</Typography>
          </Stack>
        }
        empty={visibleTimesheetFolders.length === 0}
        emptyMessage={showInactive ? 'No timesheet folders.' : 'No active timesheet folders.'}
        errorMessage={errorMessage}
        loading={loading}
      >
        <TimesheetFoldersTable timesheetFolders={visibleTimesheetFolders} />
      </ManagementListPanel>
    </ClientManagementPage>
  );
};

export default TimesheetFoldersManagement;
