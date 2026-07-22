import { useState } from 'react';
import { holidayApi } from '@/api/client';
import type { Holiday } from '@/api/generated/models/Holiday';
import CreateHolidayDialog from '@/components/HolidaysManagement/CreateHolidayDialog/CreateHolidayDialog';
import EditHolidayDialog from '@/components/HolidaysManagement/EditHolidayDialog/EditHolidayDialog';
import HolidaysTable from '@/components/HolidaysManagement/HolidaysTable/HolidaysTable';
import ClientManagementPage from '@/components/Shared/ClientManagementPage/ClientManagementPage';
import DeleteConfirmationDialog from '@/components/Shared/DeleteConfirmationDialog/DeleteConfirmationDialog';
import ManagementListPanel from '@/components/Shared/ManagementListPanel/ManagementListPanel';
import ManagementToolbar from '@/components/Shared/ManagementToolbar/ManagementToolbar';
import useFetchByKey from '@/hooks/useFetchByKey';
import useSelectedClient from '@/state/client/useSelectedClient';
import resolveErrorMessage from '@/utils/resolveErrorMessage';

const HolidaysManagement = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [deletingHoliday, setDeletingHoliday] = useState<Holiday | null>(null);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
  const { selectedClient } = useSelectedClient();
  const clientId = selectedClient?.clientId;

  const {
    data: holidays,
    errorMessage,
    loading,
    refetch,
  } = useFetchByKey(clientId, (clientId) => holidayApi.v1GetHolidays({ clientId }), 'Failed to load holidays.');

  const visibleHolidays = holidays ?? [];

  const closeDeleteDialog = () => {
    if (deleteSaving) return;

    setDeletingHoliday(null);
    setDeleteErrorMessage(null);
  };

  const deleteHoliday = async () => {
    if (deleteSaving || !clientId || !deletingHoliday?.holidayId) return;

    setDeleteSaving(true);
    setDeleteErrorMessage(null);

    try {
      await holidayApi.v1DeleteHoliday({ clientId, holidayId: deletingHoliday.holidayId });
      setDeletingHoliday(null);
      refetch();
    } catch (error) {
      console.error('Failed to delete holiday.', error);
      setDeleteErrorMessage(await resolveErrorMessage(error, 'Failed to delete holiday.'));
    } finally {
      setDeleteSaving(false);
    }
  };

  return (
    <ClientManagementPage title="Holidays">
      <ManagementListPanel
        controls={<ManagementToolbar primaryActionLabel="Create" onPrimaryAction={() => setCreateDialogOpen(true)} />}
        empty={visibleHolidays.length === 0}
        emptyMessage="No holidays."
        errorMessage={errorMessage}
        loading={loading}
      >
        <HolidaysTable holidays={visibleHolidays} onDelete={setDeletingHoliday} onEdit={setEditingHoliday} />
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
      <DeleteConfirmationDialog
        body="This removes the holiday from client configuration. Future generated timesheets and payroll calculations will no longer use it."
        errorMessage={deleteErrorMessage}
        onClose={closeDeleteDialog}
        onConfirm={deleteHoliday}
        open={deletingHoliday !== null}
        saving={deleteSaving}
        title="Delete holiday?"
      />
    </ClientManagementPage>
  );
};

export default HolidaysManagement;
