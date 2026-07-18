import { Configuration } from '@/api/generated/runtime';
import {
  AdminApi,
  ClientApi,
  EmployeeApi,
  FundingSourceApi,
  HealthApi,
  HolidayApi,
  PayPeriodApi,
  PayrollReportApi,
  TimesheetApi,
  TimesheetFolderApi,
} from '@/api/generated/apis';

const config = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL,
});

export const adminApi = new AdminApi(config);
export const clientApi = new ClientApi(config);
export const employeeApi = new EmployeeApi(config);
export const fundingSourceApi = new FundingSourceApi(config);
export const healthApi = new HealthApi(config);
export const holidayApi = new HolidayApi(config);
export const payPeriodApi = new PayPeriodApi(config);
export const payrollReportApi = new PayrollReportApi(config);
export const timesheetApi = new TimesheetApi(config);
export const timesheetFolderApi = new TimesheetFolderApi(config);
