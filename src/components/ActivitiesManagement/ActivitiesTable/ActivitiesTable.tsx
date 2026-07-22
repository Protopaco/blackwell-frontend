import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { Activity } from '@/api/generated/models/Activity';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import currencyToString from '@/utils/currencyToString';
import useTableSort from '@/hooks/useTableSort';
import { isFlatPayRate, payRateLabels } from '../activityDisplay';

type SortKey = 'name' | 'payrollCategory' | 'payRate';

type Props = {
  activities: Activity[];
  onDelete: (activity: Activity) => void;
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

const ActivitiesTable = ({ activities, onDelete, onEdit }: Props) => {
  const { sortedItems: sortedActivities, sortableHeader } = useTableSort<Activity, SortKey>(
    activities,
    {
      name: (left, right) => (left.activityName ?? '').localeCompare(right.activityName ?? '', undefined, { sensitivity: 'base' }),
      payrollCategory: (left, right) => (left.payrollCategory ?? '').localeCompare(right.payrollCategory ?? '', undefined, { sensitivity: 'base' }),
      payRate: (left, right) => (left.payRate ?? '').localeCompare(right.payRate ?? '', undefined, { sensitivity: 'base' }),
    },
    'name',
  );

  return (
    <ManagementTable
      headers={[
        sortableHeader('name', 'Activity'),
        sortableHeader('payrollCategory', 'Payroll Category'),
        sortableHeader('payRate', 'Pay Rate'),
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
            <IconButton aria-label={`Delete ${activity.activityName ?? 'activity'}`} onClick={() => onDelete(activity)} size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </ManagementTable>
  );
};

export default ActivitiesTable;
