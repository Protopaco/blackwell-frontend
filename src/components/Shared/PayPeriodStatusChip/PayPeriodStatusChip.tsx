import Chip, { type ChipProps } from '@mui/material/Chip';
import { PayPeriodStatusEnum } from '@/api/generated/models/PayPeriod';

type Props = {
  status: PayPeriodStatusEnum;
};

const payPeriodStatusColors: Record<PayPeriodStatusEnum, ChipProps['color']> = {
  [PayPeriodStatusEnum.Pending]: 'default',
  [PayPeriodStatusEnum.Open]: 'success',
  [PayPeriodStatusEnum.Processed]: 'warning',
  [PayPeriodStatusEnum.Closed]: 'default',
};

const PayPeriodStatusChip = ({ status }: Props) => {
  return <Chip label={status} color={payPeriodStatusColors[status]} size="small" />;
};

export default PayPeriodStatusChip;
