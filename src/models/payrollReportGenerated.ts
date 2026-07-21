import { PayPeriodStatusEnum } from '@/api/generated/models/PayPeriod';

// True once a payroll report exists for this pay period (set by generatePayrollReport.ts on the backend).
const payrollReportGenerated = (status: PayPeriodStatusEnum | undefined): boolean =>
  status === PayPeriodStatusEnum.Processed || status === PayPeriodStatusEnum.Allocated || status === PayPeriodStatusEnum.Closed;

export default payrollReportGenerated;
