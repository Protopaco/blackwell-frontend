import { useState } from 'react';
import { holidayApi } from '@/api/client';
import type { Holiday } from '@/api/generated/models/Holiday';
import CreateHolidayDialog from '@/components/HolidaysManagement/CreateHolidayDialog/CreateHolidayDialog';
import EditHolidayDialog from '@/components/HolidaysManagement/EditHolidayDialog/EditHolidayDialog';
import HolidaysTable from '@/components/HolidaysManagement/HolidaysTable/HolidaysTable';
import ClientManagementPage from '@/components/Shared/ClientManagementPage/ClientManagementPage';
import ManagementListPanel from '@/components/Shared/ManagementListPanel/ManagementListPanel';
import ManagementToolbar from '@/components/Shared/ManagementToolbar/ManagementToolbar';
import useFetchByKey from '@/hooks/useFetchByKey';
import useSelectedClient from '@/state/client/useSelectedClient';

const HolidaysManagement = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const { selectedClient } = useSelectedClient();
  const clientId = selectedClient?.clientId;

  const {
    data: holidays,
    errorMessage,
    loading,
    refetch,
  } = useFetchByKey(clientId, (clientId) => holidayApi.v1GetHolidays({ clientId }), 'Failed to load holidays.');

  const visibleHolidays = holidays ?? [];

  return (
    <ClientManagementPage title="Holidays">
      <ManagementListPanel
        controls={<ManagementToolbar primaryActionLabel="Create" onPrimaryAction={() => setCreateDialogOpen(true)} />}
        empty={visibleHolidays.length === 0}
        emptyMessage="No holidays."
        errorMessage={errorMessage}
        loading={loading}
      >
        <HolidaysTable holidays={visibleHolidays} onEdit={setEditingHoliday} />
      </ManagementListPanel>
      {clientId ? <CreateHolidayDialog clientId={clientId} open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} onCreated={refetch} /> : null}
      {clientId ? (
        <EditHolidayDialog
          clientId={clientId}
          holiday={editingHoliday}
          open={editingHoliday !== null}
          onClose={() => setEditingHoliday(null)}
          onSaved={refetch}
        />
      ) : null}
    </ClientManagementPage>
  );
};

export default HolidaysManagement;
