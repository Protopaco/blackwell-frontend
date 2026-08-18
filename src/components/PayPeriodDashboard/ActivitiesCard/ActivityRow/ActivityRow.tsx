import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { Activity } from '@/api/generated/models/Activity';

type Props = {
  activity: Activity;
  canEdit: boolean;
  canRemove: boolean;
  onEdit: () => void;
  onRemove: () => void;
  removing: boolean;
};

const formatFundingAllocations = (activity: Activity) => {
  return (
    activity.fundingSources
      ?.map((fundingSource) => {
        if (!fundingSource.fundingSourceName) return '';
        if (fundingSource.percentage === undefined) return fundingSource.fundingSourceName;
        return `${fundingSource.fundingSourceName} ${fundingSource.percentage}%`;
      })
      .filter(Boolean) ?? []
  );
};

const ActivityRow = ({ activity, canEdit, canRemove, onEdit, onRemove, removing }: Props) => {
  return (
    <TableRow>
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
      <TableCell align="center">
        <Tooltip title={canEdit ? 'Edit' : 'Nothing left to edit — this pay period has been allocated.'}>
          <span>
            <IconButton aria-label="Edit activity" onClick={onEdit} disabled={!canEdit} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>
      <TableCell align="center">
        {removing ? (
          <CircularProgress size={20} />
        ) : (
          <Tooltip title={canRemove ? 'Remove from this pay period' : 'A timesheet has already been generated for this pay period.'}>
            <span>
              <IconButton aria-label="Remove from this pay period" onClick={onRemove} disabled={!canRemove} size="small">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ActivityRow;
