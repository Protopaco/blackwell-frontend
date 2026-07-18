import { useMemo, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { ActivityPayRateEnum } from '@/api/generated/models/Activity';
import type { Activity, ActivityPayRateEnum as ActivityPayRate } from '@/api/generated/models/Activity';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import currencyToString from '@/utils/currencyToString';

type Props = {
  activities: Activity[];
};

type SortKey = 'name' | 'payrollCategory' | 'payRate';

type SortDirection = 'asc' | 'desc';

const payRateLabels: Record<ActivityPayRate, string> = {
  [ActivityPayRateEnum.HourlyPayRate1]: 'Hourly 1',
  [ActivityPayRateEnum.HourlyPayRate2]: 'Hourly 2',
  [ActivityPayRateEnum.FlatPayRate1]: 'Flat 1',
  [ActivityPayRateEnum.FlatPayRate2]: 'Flat 2',
};

const isFlatPayRate = (payRate: Activity['payRate']) => payRate === ActivityPayRateEnum.FlatPayRate1 || payRate === ActivityPayRateEnum.FlatPayRate2;

const formatFundingAllocation = (activity: Activity) => {
  return (
    activity.fundingSources
      ?.map((fundingSource) => {
        if (!fundingSource.fundingSourceName) return '';
        if (fundingSource.percentage === undefined) return fundingSource.fundingSourceName;
        return `${fundingSource.fundingSourceName} ${fundingSource.percentage}%`;
      })
      .filter(Boolean)
      .join(', ') ?? ''
  );
};

const ActivitiesTable = ({ activities }: Props) => {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedActivities = useMemo(() => {
    return [...activities].sort((left, right) => {
      const directionMultiplier = sortDirection === 'asc' ? 1 : -1;

      switch (sortKey) {
        case 'payrollCategory':
          return directionMultiplier * (left.payrollCategory ?? '').localeCompare(right.payrollCategory ?? '', undefined, { sensitivity: 'base' });
        case 'payRate':
          return directionMultiplier * (left.payRate ?? '').localeCompare(right.payRate ?? '', undefined, { sensitivity: 'base' });
        case 'name':
        default:
          return directionMultiplier * (left.activityName ?? '').localeCompare(right.activityName ?? '', undefined, { sensitivity: 'base' });
      }
    });
  }, [activities, sortDirection, sortKey]);

  const updateSort = (nextSortKey: SortKey) => {
    if (nextSortKey === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection('asc');
  };

  return (
    <ManagementTable
      headers={[
        { label: 'Activity', sortDirection: sortKey === 'name' ? sortDirection : undefined, onSort: () => updateSort('name') },
        {
          label: 'Payroll Category',
          sortDirection: sortKey === 'payrollCategory' ? sortDirection : undefined,
          onSort: () => updateSort('payrollCategory'),
        },
        { label: 'Pay Rate', sortDirection: sortKey === 'payRate' ? sortDirection : undefined, onSort: () => updateSort('payRate') },
        { label: 'Flat Rate Amount' },
        { label: 'Funding Allocation' },
        { label: 'Track Separately' },
      ]}
    >
      {sortedActivities.map((activity) => (
        <TableRow key={activity.activityId ?? activity.activityName ?? ''}>
          <TableCell>{activity.activityName}</TableCell>
          <TableCell>{activity.payrollCategory}</TableCell>
          <TableCell>{activity.payRate ? payRateLabels[activity.payRate] : ''}</TableCell>
          <TableCell>{isFlatPayRate(activity.payRate) ? currencyToString(activity.flatRateAmount, { decorated: true }) : ''}</TableCell>
          <TableCell>{formatFundingAllocation(activity)}</TableCell>
          <TableCell>{activity.trackSeparately ? 'Yes' : 'No'}</TableCell>
        </TableRow>
      ))}
    </ManagementTable>
  );
};

export default ActivitiesTable;
