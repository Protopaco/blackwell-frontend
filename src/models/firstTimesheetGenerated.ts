import { PayPeriodStatusEnum } from '@/api/generated/models/PayPeriod';

// True once the first timesheet has been generated for this pay period — the point at which
// Activity/FundingSource/Holiday presence locks on the backend (assertPayPeriodNotLocked.ts).
const firstTimesheetGenerated = (status: PayPeriodStatusEnum | undefined): boolean => status !== PayPeriodStatusEnum.Pending;

export default firstTimesheetGenerated;
