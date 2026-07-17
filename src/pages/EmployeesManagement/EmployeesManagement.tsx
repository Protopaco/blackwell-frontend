import { useState } from 'react';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { employeeApi } from '@/api/client';
import { EmployeeStatusEnum } from '@/api/generated/models/Employee';
import ClientManagementPage from '@/components/Shared/ClientManagementPage/ClientManagementPage';
import ManagementListPanel from '@/components/Shared/ManagementListPanel/ManagementListPanel';
import ManagementToolbar from '@/components/Shared/ManagementToolbar/ManagementToolbar';
import EmployeesTable from '@/components/EmployeesManagement/EmployeesTable/EmployeesTable';
import useFetchByKey from '@/hooks/useFetchByKey';
import useSelectedClient from '@/state/client/useSelectedClient';

const EmployeesManagement = () => {
  const [showInactive, setShowInactive] = useState(false);
  const { selectedClient } = useSelectedClient();
  const clientId = selectedClient?.clientId;

  const {
    data: employees,
    errorMessage,
    loading,
  } = useFetchByKey(clientId, (clientId) => employeeApi.v1GetEmployees({ clientId }), 'Failed to load employees.');

  const visibleEmployees = employees?.filter((employee) => showInactive || employee.status === EmployeeStatusEnum.Active) ?? [];

  return (
    <ClientManagementPage title="Employees">
      <ManagementListPanel
        controls={
          <ManagementToolbar>
            <Switch checked={showInactive} onChange={(event) => setShowInactive(event.target.checked)} size="small" />
            <Typography>Show inactive</Typography>
          </ManagementToolbar>
        }
        empty={visibleEmployees.length === 0}
        emptyMessage={showInactive ? 'No employees.' : 'No active employees.'}
        errorMessage={errorMessage}
        loading={loading}
      >
        <EmployeesTable employees={visibleEmployees} />
      </ManagementListPanel>
    </ClientManagementPage>
  );
};

export default EmployeesManagement;
