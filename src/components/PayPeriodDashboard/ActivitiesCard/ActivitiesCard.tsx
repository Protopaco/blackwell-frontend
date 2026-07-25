import ActivityRow from '@/components/PayPeriodDashboard/ActivitiesCard/ActivityRow/ActivityRow';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import useTableSort from '@/hooks/useTableSort';
import type { Activity } from '@/api/generated/models/Activity';

type Props = {
  activities: Activity[];
};

type SortKey = 'name' | 'payrollCategory' | 'payRate';

const ActivitiesCard = ({ activities }: Props) => {
  const { sortedItems: sortedActivities, sortableHeader } = useTableSort<Activity, SortKey>(
    activities,
    {
      name: (left, right) => (left.activityName ?? '').localeCompare(right.activityName ?? '', undefined, { sensitivity: 'base' }),
      payrollCategory: (left, right) =>
        (left.payrollCategory ?? '').localeCompare(right.payrollCategory ?? '', undefined, { sensitivity: 'base' }),
      payRate: (left, right) => (left.payRate ?? '').localeCompare(right.payRate ?? '', undefined, { sensitivity: 'base' }),
    },
    'name',
  );

  return (
    <DashboardCard id="activities-card" header="Activities" configPath={null}>
      <ManagementTable
        headers={[
          sortableHeader('name', 'Activity'),
          sortableHeader('payrollCategory', 'Payroll Category'),
          sortableHeader('payRate', 'Pay Rate'),
          { label: 'Flat Rate Amount' },
          { label: 'Funding Allocation' },
          { label: 'Track Separately' },
        ]}
      >
        {sortedActivities.map((activity) => (
          <ActivityRow key={activity.activityId ?? activity.activityName ?? ''} activity={activity} />
        ))}
      </ManagementTable>
    </DashboardCard>
  );
};

export default ActivitiesCard;
