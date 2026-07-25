import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { isFlatPayRate, payRateLabels } from '@/components/ActivitiesManagement/activityDisplay';
import currencyToString from '@/utils/currencyToString';
import type { Activity } from '@/api/generated/models/Activity';

type Props = {
  activity: Activity;
  canRemove: boolean;
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

const ActivityRow = ({ activity, canRemove, onRemove, removing }: Props) => {
  return (
    <TableRow>
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
