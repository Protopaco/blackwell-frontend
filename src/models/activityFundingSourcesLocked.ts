import { PayPeriodStatusEnum } from '@/api/generated/models/PayPeriod';

// True once Activity funding-source percentage edits lock for this pay period (status Allocated or later).
const activityFundingSourcesLocked = (status: PayPeriodStatusEnum | undefined): boolean =>
  status === PayPeriodStatusEnum.Allocated || status === PayPeriodStatusEnum.Closed;

export default activityFundingSourcesLocked;
