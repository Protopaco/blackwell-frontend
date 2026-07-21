import { PayPeriodStatusEnum } from '@/api/generated/models/PayPeriod';

// True once an allocation report exists for this pay period (set by generateAllocationReport.ts on the backend).
const allocationReportGenerated = (status: PayPeriodStatusEnum | undefined): boolean =>
  status === PayPeriodStatusEnum.Allocated || status === PayPeriodStatusEnum.Closed;

export default allocationReportGenerated;
