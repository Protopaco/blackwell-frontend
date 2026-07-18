import { useMemo, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import type { Activity } from '@/api/generated/models/Activity';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';

type Props = {
  activities: Activity[];
};

type SortKey = 'name' | 'payrollCategory' | 'payRate';

type SortDirection = 'asc' | 'desc';

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
        { label: 'Track Separately' },
      ]}
    >
      {sortedActivities.map((activity) => (
        <TableRow key={activity.activityId ?? activity.activityName ?? ''}>
          <TableCell>{activity.activityName}</TableCell>
          <TableCell>{activity.payrollCategory}</TableCell>
          <TableCell>{activity.payRate}</TableCell>
          <TableCell>{activity.trackSeparately ? 'Yes' : 'No'}</TableCell>
        </TableRow>
      ))}
    </ManagementTable>
  );
};

export default ActivitiesTable;
