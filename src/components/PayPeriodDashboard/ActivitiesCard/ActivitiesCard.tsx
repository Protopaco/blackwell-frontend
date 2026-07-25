import { useState } from 'react';
import { payPeriodApi } from '@/api/client';
import ActivityDialog from '@/components/ActivitiesManagement/ActivityDialog/ActivityDialog';
import ActivityRow from '@/components/PayPeriodDashboard/ActivitiesCard/ActivityRow/ActivityRow';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import useTableSort from '@/hooks/useTableSort';
import activityFundingSourcesLocked from '@/models/activityFundingSourcesLocked';
import firstTimesheetGenerated from '@/models/firstTimesheetGenerated';
import { useToast } from '@/state/toast/toast.context';
import resolveErrorMessage from '@/utils/resolveErrorMessage';
import type { Activity } from '@/api/generated/models/Activity';
import type { FundingSource } from '@/api/generated/models/FundingSource';
import type { PayPeriodStatusEnum } from '@/api/generated/models/PayPeriod';

type Props = {
  clientId: string;
  payPeriodId: string;
  activities: Activity[];
  fundingSources: FundingSource[];
  payPeriodStatus: PayPeriodStatusEnum | undefined;
  onActivitiesChanged: () => void;
};

type SortKey = 'name' | 'payrollCategory' | 'payRate';

const structuralFieldsLockedMessage = 'A timesheet has already been generated for this pay period.';
const percentagesLockedMessage = 'Funding allocation percentages lock once the pay period has been allocated.';

const ActivitiesCard = ({ clientId, payPeriodId, activities, fundingSources, payPeriodStatus, onActivitiesChanged }: Props) => {
  const { showToast } = useToast();
  const [removingActivityId, setRemovingActivityId] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  const structuralFieldsLocked = firstTimesheetGenerated(payPeriodStatus);
  const percentagesLocked = activityFundingSourcesLocked(payPeriodStatus);
  const canRemove = !structuralFieldsLocked;
  const canEdit = !percentagesLocked;

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

  const handleSave = async (activity: Activity) => {
    setSaving(true);
    setSaveErrorMessage(null);
    try {
      await payPeriodApi.v1UpdateActivityOnPayPeriod({ clientId, payPeriodId, activityId: activity.activityId!, activity });
      showToast('Activity updated.', 'success');
      setEditingActivity(null);
      onActivitiesChanged();
    } catch (error) {
      const message = await resolveErrorMessage(error, 'Failed to update activity.');
      setSaveErrorMessage(message);
    } finally {
      setSaving(false);
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
          { label: 'Edit', align: 'center' },
          { label: 'Remove', align: 'center' },
        ]}
      >
        {sortedActivities.map((activity) => (
          <ActivityRow
            key={activity.activityId ?? activity.activityName ?? ''}
            activity={activity}
            canEdit={canEdit}
            canRemove={canRemove}
            onEdit={() => setEditingActivity(activity)}
            onRemove={() => handleRemove(activity.activityId!)}
            removing={removingActivityId === activity.activityId}
          />
        ))}
      </ManagementTable>
      <ActivityDialog
        activity={editingActivity}
        errorMessage={saveErrorMessage}
        fundingSources={fundingSources}
        formId="edit-pay-period-activity"
        onClose={() => setEditingActivity(null)}
        onSave={handleSave}
        open={editingActivity !== null}
        percentagesLocked={percentagesLocked}
        percentagesLockedMessage={percentagesLockedMessage}
        saving={saving}
        structuralFieldsLocked={structuralFieldsLocked}
        structuralFieldsLockedMessage={structuralFieldsLockedMessage}
        submitLabel="Save"
        title="Edit Activity"
      />
    </DashboardCard>
  );
};

export default ActivitiesCard;
