import type { V1GetPayrollReport200ResponseValueFlatRateInner } from '@/api/generated/models/V1GetPayrollReport200ResponseValueFlatRateInner';
import type { V1GetPayrollReport200ResponseValueHourlyInner } from '@/api/generated/models/V1GetPayrollReport200ResponseValueHourlyInner';

interface PayrollReportRow {
  employeeId: string;
  employeeName: string;
  totalHours: number;
  totalFlatRate: number;
  totalExpense: number | null;
  hourly: V1GetPayrollReport200ResponseValueHourlyInner[];
  flatRate: V1GetPayrollReport200ResponseValueFlatRateInner[];
}

export type { PayrollReportRow };
