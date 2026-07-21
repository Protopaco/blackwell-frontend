import { payrollReportApi } from '@/api/client';
import { ResponseError } from '@/api/generated/runtime';

// No payroll report has been generated yet for this pay period — not an error, just an empty state.
const fetchPayrollReport = async (clientId: string, payPeriodId: string) => {
  try {
    return await payrollReportApi.v1GetPayrollReport({ clientId, payPeriodId });
  } catch (error) {
    if (error instanceof ResponseError && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export default fetchPayrollReport;
