import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import DashboardList from '@/components/Shared/DashboardList/DashboardList';
import type { TimesheetFolder } from '@/api/generated/models/TimesheetFolder';

type Props = {
  clientId: string;
  timesheetFolders: TimesheetFolder[];
};

const ClientTimesheetFoldersCard = ({ clientId, timesheetFolders }: Props) => {
  return (
    <DashboardCard id="client-timesheet-folders-card" header="Timesheet Folders" configPath={`/client/${clientId}/timesheetFolders`}>
      <DashboardList
        items={timesheetFolders.map((timesheetFolder) => ({
          key: timesheetFolder.timesheetFolderId ?? timesheetFolder.timesheetFolderName ?? '',
          labels: [timesheetFolder.timesheetFolderName ?? ''],
        }))}
      />
    </DashboardCard>
  );
};

export default ClientTimesheetFoldersCard;
