import SubList from '@/components/Shared/SubList/SubList';
import type { V1GetPayrollReport200ResponseValueHourlyInner } from '@/api/generated/models/V1GetPayrollReport200ResponseValueHourlyInner';

type Props = {
  hourly: V1GetPayrollReport200ResponseValueHourlyInner[];
};

const PayrollReportHourlyList = ({ hourly }: Props) => {
  const entries = hourly.filter((entry) => (entry.totalHours ?? 0) !== 0);

  return (
    <SubList
      entries={entries}
      columns={[
        { key: 'payrollCategory', label: 'Payroll Category' },
        { key: 'payRate', label: 'Pay Rate' },
        { key: 'isHoliday', label: 'Holiday', format: (value) => (value ? 'Yes' : 'No') },
        { key: 'totalHours', label: 'Total Hours', format: (value) => (value ?? 0).toFixed(2) },
      ]}
    />
  );
};

export default PayrollReportHourlyList;
