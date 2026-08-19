import { EmployeeActivityRatePayRateTypeEnum } from '@/api/generated/models/EmployeeActivityRate';
import type { Activity } from '@/api/generated/models/Activity';
import type { EmployeeActivityRateFormRow } from './EmployeeActivityRateFormRow';

// Builds the row appended when "Add activity" is clicked: picks the first activity not already selected,
// and defaults payRateType/payRate/holidayPayRate from the last existing row so repeat entries (e.g. the
// same hourly rate across several activities) don't have to be retyped each time.
const buildNewActivityRate = (
  currentActivityRates: EmployeeActivityRateFormRow[],
  activities: Activity[],
): EmployeeActivityRateFormRow => {
  const currentActivityIds = currentActivityRates.map((activityRate) => activityRate.activityId).filter(Boolean);
  const availableActivity = activities.find((activity) => !currentActivityIds.includes(activity.activityId ?? ''));
  const previousActivityRate = currentActivityRates[currentActivityRates.length - 1];

  return {
    activityId: availableActivity?.activityId ?? '',
    payRateType: previousActivityRate?.payRateType ?? EmployeeActivityRatePayRateTypeEnum.Hourly,
    payRate: previousActivityRate?.payRate ?? '',
    holidayPayRate: previousActivityRate?.holidayPayRate ?? '',
  };
};

export default buildNewActivityRate;
