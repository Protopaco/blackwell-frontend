import { useState } from 'react';
import { payPeriodApi } from '@/api/client';
import ActivityRow from '@/components/PayPeriodDashboard/ActivitiesCard/ActivityRow/ActivityRow';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import useTableSort from '@/hooks/useTableSort';
import { useToast } from '@/state/toast/toast.context';
import resolveErrorMessage from '@/utils/resolveErrorMessage';
import type { Activity } from '@/api/generated/models/Activity';

type Props = {
  clientId: string;
  payPeriodId: string;
  activities: Activity[];
  canRemove: boolean;
  onActivitiesChanged: () => void;
};

type SortKey = 'name' | 'payrollCategory' | 'payRate';

const ActivitiesCard = ({ clientId, payPeriodId, activities, canRemove, onActivitiesChanged }: Props) => {
  const { showToast } = useToast();
  const [removingActivityId, setRemovingActivityId] = useState<string | null>(null);

  const handleRemove = async (activityId: string) => {
    setRemovingActivityId(activityId);
    try {
      await payPeriodApi.v1RemoveActivityFromPayPeriod({ clientId, payPeriodId, activityId });
      showToast('Activity removed from pay period.', 'success');
      onActivitiesChanged();
    } catch (error) {
      const message = await resolveErrorMessage(error, 'Failed to remove activity from pay period.');
      showToast(message, 'error');
    } finally {
      setRemovingActivityId(null);
    }
  };

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
          { label: 'Remove', align: 'center' },
        ]}
      >
        {sortedActivities.map((activity) => (
          <ActivityRow
            key={activity.activityId ?? activity.activityName ?? ''}
            activity={activity}
            canRemove={canRemove}
            onRemove={() => handleRemove(activity.activityId!)}
            removing={removingActivityId === activity.activityId}
          />
        ))}
      </ManagementTable>
    </DashboardCard>
  );
};

export default ActivitiesCard;
