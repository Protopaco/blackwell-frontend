import { Fragment } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { Activity } from '@/api/generated/models/Activity';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import groupActivitiesForDisplay from './groupActivitiesForDisplay';

type Props = {
  activities: Activity[];
  onDelete: (activity: Activity) => void;
  onEdit: (activity: Activity) => void;
};

const ACTIVITIES_TABLE_COLUMN_COUNT = 4;

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
  const activityGroups = groupActivitiesForDisplay(activities);

  return (
    <ManagementTable
      headers={[
        { label: 'Activity' },
        { label: 'Payroll Category' },
        { label: 'Funding Allocation' },
        { label: 'Actions', align: 'right' },
      ]}
    >
      {activityGroups.map((activityGroup) => (
        <Fragment key={activityGroup.groupLabel ?? 'ungrouped'}>
          {activityGroup.groupLabel && (
            <TableRow key={`group-${activityGroup.groupLabel}`}>
              <TableCell colSpan={ACTIVITIES_TABLE_COLUMN_COUNT} sx={{ backgroundColor: 'action.hover', fontWeight: 'bold' }}>
                {activityGroup.groupLabel}
              </TableCell>
            </TableRow>
          )}
          {activityGroup.activities.map((activity) => (
            <TableRow key={activity.activityId ?? activity.activityName ?? ''}>
              <TableCell>{activity.activityName}</TableCell>
              <TableCell>{activity.payrollCategory}</TableCell>
              <TableCell>
                <Stack spacing={0.5}>
                  {formatFundingAllocations(activity).map((fundingAllocation) => (
                    <Typography key={fundingAllocation} variant="body2">
                      {fundingAllocation}
                    </Typography>
                  ))}
                </Stack>
              </TableCell>
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
        </Fragment>
      ))}
    </ManagementTable>
  );
};

export default ActivitiesTable;
