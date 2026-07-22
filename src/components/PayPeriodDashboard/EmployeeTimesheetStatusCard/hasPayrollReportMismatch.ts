import type { EmployeeTimesheetStatus } from '@/api/generated/models/EmployeeTimesheetStatus';
import type { V1GetPayrollReport200ResponseValue } from '@/api/generated/models/V1GetPayrollReport200ResponseValue';

type PayrollReport = { [employeeId: string]: V1GetPayrollReport200ResponseValue } | null;

// True when the live timesheet totals for an employee no longer match what was captured in the generated payroll report.
const hasPayrollReportMismatch = (employee: EmployeeTimesheetStatus, payrollReport: PayrollReport): boolean => {
  if (!payrollReport || !employee.employeeId) return false;

  const reportRow = payrollReport[employee.employeeId];
  if (!reportRow) return false;

  const liveHours = employee.totalHours ?? 0;
  const liveFlatRateQuantity = employee.flatRateQuantity ?? 0;
  const reportHours = reportRow.totalHours ?? 0;
  const reportFlatRate = reportRow.totalFlatRate ?? 0;

  return liveHours !== reportHours || liveFlatRateQuantity !== reportFlatRate;
};

export default hasPayrollReportMismatch;
