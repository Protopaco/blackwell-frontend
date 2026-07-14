import Chip, { type ChipProps } from '@mui/material/Chip';
import { EmployeeTimesheetStatusStatusEnum } from '@/api/generated/models/EmployeeTimesheetStatus';

type Props = {
  status: EmployeeTimesheetStatusStatusEnum;
};

const employeeTimesheetStatusColors: Record<EmployeeTimesheetStatusStatusEnum, ChipProps['color']> = {
  [EmployeeTimesheetStatusStatusEnum.NotGenerated]: 'default',
  [EmployeeTimesheetStatusStatusEnum.Generated]: 'info',
  [EmployeeTimesheetStatusStatusEnum.Submitted]: 'warning',
  [EmployeeTimesheetStatusStatusEnum.Approved]: 'primary',
  [EmployeeTimesheetStatusStatusEnum.Complete]: 'success',
};

const EmployeeTimesheetStatusChip = ({ status }: Props) => {
  return <Chip label={status} color={employeeTimesheetStatusColors[status]} size="small" />;
};

export default EmployeeTimesheetStatusChip;
