import SubList from '@/components/Shared/SubList/SubList';
import type { V1GetPayrollReport200ResponseValueFlatRateInner } from '@/api/generated/models/V1GetPayrollReport200ResponseValueFlatRateInner';

type Props = {
  flatRate: V1GetPayrollReport200ResponseValueFlatRateInner[];
};

const PayrollReportFlatRateList = ({ flatRate }: Props) => {
  const entries = flatRate.filter((entry) => (entry.quantity ?? 0) !== 0);

  return (
    <SubList
      entries={entries}
      columns={[
        { key: 'payRate', label: 'Pay Rate' },
        { key: 'quantity', label: 'Quantity', format: (value) => (value ?? 0).toFixed(2) },
      ]}
    />
  );
};

export default PayrollReportFlatRateList;
