import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { isFlatPayRate, payRateLabels } from '@/components/ActivitiesManagement/activityDisplay';
import currencyToString from '@/utils/currencyToString';
import type { Activity } from '@/api/generated/models/Activity';

type Props = {
  activity: Activity;
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

const ActivityRow = ({ activity }: Props) => {
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
    </TableRow>
  );
};

export default ActivityRow;
