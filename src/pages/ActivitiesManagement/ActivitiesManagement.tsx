import { activityApi } from '@/api/client';
import ActivitiesTable from '@/components/ActivitiesManagement/ActivitiesTable/ActivitiesTable';
import ClientManagementPage from '@/components/Shared/ClientManagementPage/ClientManagementPage';
import ManagementListPanel from '@/components/Shared/ManagementListPanel/ManagementListPanel';
import useFetchByKey from '@/hooks/useFetchByKey';
import useSelectedClient from '@/state/client/useSelectedClient';

const ActivitiesManagement = () => {
  const { selectedClient } = useSelectedClient();
  const clientId = selectedClient?.clientId;

  const {
    data: activities,
    errorMessage,
    loading,
  } = useFetchByKey(clientId, (clientId) => activityApi.v1GetActivities({ clientId }), 'Failed to load activities.');

  const visibleActivities = activities ?? [];

  return (
    <ClientManagementPage title="Activities">
      <ManagementListPanel empty={visibleActivities.length === 0} emptyMessage="No activities." errorMessage={errorMessage} loading={loading}>
        <ActivitiesTable activities={visibleActivities} />
      </ManagementListPanel>
    </ClientManagementPage>
  );
};

export default ActivitiesManagement;
