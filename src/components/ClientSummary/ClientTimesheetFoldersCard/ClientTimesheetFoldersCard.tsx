import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import DashboardList from '@/components/Shared/DashboardList/DashboardList';
import type { TimesheetFolder } from '@/api/generated/models/TimesheetFolder';

type Props = {
  timesheetFolders: TimesheetFolder[];
};

const ClientTimesheetFoldersCard = ({ timesheetFolders }: Props) => {
  return (
    <DashboardCard id="client-timesheet-folders-card" header="Timesheet Folders" configPath={null}>
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
