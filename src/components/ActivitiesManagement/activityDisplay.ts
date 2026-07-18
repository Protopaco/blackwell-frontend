import { ActivityPayRateEnum } from '@/api/generated/models/Activity';
import type { Activity, ActivityPayRateEnum as ActivityPayRate } from '@/api/generated/models/Activity';

const payRateLabels: Record<ActivityPayRate, string> = {
  [ActivityPayRateEnum.HourlyPayRate1]: 'Hourly 1',
  [ActivityPayRateEnum.HourlyPayRate2]: 'Hourly 2',
  [ActivityPayRateEnum.FlatPayRate1]: 'Flat 1',
  [ActivityPayRateEnum.FlatPayRate2]: 'Flat 2',
};

const isFlatPayRate = (payRate: Activity['payRate']) => payRate === ActivityPayRateEnum.FlatPayRate1 || payRate === ActivityPayRateEnum.FlatPayRate2;

export { isFlatPayRate, payRateLabels };
