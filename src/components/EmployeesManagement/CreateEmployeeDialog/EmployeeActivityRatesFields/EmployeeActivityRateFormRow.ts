import type { EmployeeActivityRatePayRateTypeEnum } from '@/api/generated/models/EmployeeActivityRate';

export type EmployeeActivityRateFormRow = {
  id?: string;
  activityId: string;
  payRateType: EmployeeActivityRatePayRateTypeEnum;
  payRate: string;
  holidayPayRate: string;
};
