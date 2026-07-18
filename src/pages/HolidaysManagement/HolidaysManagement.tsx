import { holidayApi } from '@/api/client';
import HolidaysTable from '@/components/HolidaysManagement/HolidaysTable/HolidaysTable';
import ClientManagementPage from '@/components/Shared/ClientManagementPage/ClientManagementPage';
import ManagementListPanel from '@/components/Shared/ManagementListPanel/ManagementListPanel';
import useFetchByKey from '@/hooks/useFetchByKey';
import useSelectedClient from '@/state/client/useSelectedClient';

const HolidaysManagement = () => {
  const { selectedClient } = useSelectedClient();
  const clientId = selectedClient?.clientId;

  const {
    data: holidays,
    errorMessage,
    loading,
  } = useFetchByKey(clientId, (clientId) => holidayApi.v1GetHolidays({ clientId }), 'Failed to load holidays.');

  const visibleHolidays = holidays ?? [];

  return (
    <ClientManagementPage title="Holidays">
      <ManagementListPanel
        empty={visibleHolidays.length === 0}
        emptyMessage="No holidays."
        errorMessage={errorMessage}
        loading={loading}
      >
        <HolidaysTable holidays={visibleHolidays} />
      </ManagementListPanel>
    </ClientManagementPage>
  );
};

export default HolidaysManagement;
