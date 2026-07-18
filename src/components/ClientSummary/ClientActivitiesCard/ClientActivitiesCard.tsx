import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import DashboardList from '@/components/Shared/DashboardList/DashboardList';
import type { Activity } from '@/api/generated/models/Activity';

type Props = {
  clientId: string;
  activities: Activity[];
};

const ClientActivitiesCard = ({ clientId, activities }: Props) => {
  return (
    <DashboardCard id="client-activities-card" header="Activities" configPath={`/client/${clientId}/activities`}>
      <DashboardList
        items={activities.map((activity) => ({
          key: activity.activityId ?? activity.activityName ?? '',
          labels: [activity.activityName ?? '', activity.payrollCategory ?? ''],
        }))}
      />
    </DashboardCard>
  );
};

export default ClientActivitiesCard;
