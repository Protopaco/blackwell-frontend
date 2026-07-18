import { useMemo, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { Activity } from '@/api/generated/models/Activity';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import currencyToString from '@/utils/currencyToString';
import { isFlatPayRate, payRateLabels } from '../activityDisplay';

type SortKey = 'name' | 'payrollCategory' | 'payRate';

type SortDirection = 'asc' | 'desc';

type Props = {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
};

const formatFundingAllocations = (activity: Activity) => {
  return (
    activity.fundingSources
      ?.map((fundingSource) => {
        if (!fundingSource.fundingSourceName) return '';
        if (fundingSource.percentage === undefined) return fundingSource.fundingSourceName;
        return `${fundingSource.fundingSourceName} ${fundingSource.percentage}%`;
      })
      .filter(Boolean)
      ?? []
  );
};

const ActivitiesTable = ({ activities, onEdit }: Props) => {
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
        { label: 'Actions', align: 'right' },
      ]}
    >
      {sortedActivities.map((activity) => (
        <TableRow key={activity.activityId ?? activity.activityName ?? ''}>
          <TableCell>{activity.activityName}</TableCell>
          <TableCell>{activity.payrollCategory}</TableCell>
          <TableCell>{activity.payRate ? payRateLabels[activity.payRate] : ''}</TableCell>
          <TableCell>{isFlatPayRate(activity.payRate) ? currencyToString(activity.flatRateAmount, { decorated: true }) : ''}</TableCell>
          <TableCell>
            <Stack spacing={0.5}>
              {formatFundingAllocations(activity).map((fundingAllocation) => (
                <Typography key={fundingAllocation} variant="body2">
                  {fundingAllocation}
                </Typography>
              ))}
            </Stack>
          </TableCell>
          <TableCell>{activity.trackSeparately ? 'Yes' : 'No'}</TableCell>
          <TableCell align="right">
            <IconButton aria-label={`Edit ${activity.activityName ?? 'activity'}`} onClick={() => onEdit(activity)} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </ManagementTable>
  );
};

export default ActivitiesTable;
