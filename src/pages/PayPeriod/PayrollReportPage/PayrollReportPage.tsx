import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { payrollReportApi } from '@/api/client';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import PayrollReportTable from '@/components/PayPeriod/PayrollReportTable/PayrollReportTable';
import type { PayrollReportRow } from '@/components/PayPeriod/PayrollReportTable/PayrollReportRow';
import type { EmployeeExpenseUpdate } from '@/api/generated/models/EmployeeExpenseUpdate';
import useAsyncAction from '@/hooks/useAsyncAction';
import useFetchByKey from '@/hooks/useFetchByKey';
import fetchPayrollReport from '@/utils/fetchPayrollReport';

const PayrollReportPage = () => {
  const { clientId, payPeriodId } = useParams<{ clientId: string; payPeriodId: string }>();
  const key = clientId && payPeriodId ? `${clientId}/${payPeriodId}` : undefined;

  const {
    data: payrollReport,
    errorMessage: payrollReportErrorMessage,
    loading: payrollReportLoading,
    refetch: refetchPayrollReport,
  } = useFetchByKey(key, () => fetchPayrollReport(clientId!, payPeriodId!), 'Failed to load payroll report.');

  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  const rows = useMemo((): PayrollReportRow[] => {
    if (!payrollReport) return [];

    return Object.entries(payrollReport)
      .map(([employeeId, report]) => ({
        employeeId,
        employeeName: report.employeeName ?? '',
        totalHours: report.totalHours ?? 0,
        totalFlatRate: report.totalFlatRate ?? 0,
        totalExpense: report.totalExpense ?? null,
      }))
      .sort((left, right) => left.employeeName.localeCompare(right.employeeName, undefined, { sensitivity: 'base' }));
  }, [payrollReport]);

  const dirtyEntries = useMemo(() => {
    return Object.entries(editedValues).flatMap(([employeeId, rawValue]) => {
      const row = rows.find((candidate) => candidate.employeeId === employeeId);
      if (!row) return [];

      const trimmedValue = rawValue.trim();
      const parsedValue = trimmedValue === '' ? null : Number(trimmedValue);
      const invalid = trimmedValue !== '' && Number.isNaN(parsedValue);
      const changed = !invalid && parsedValue !== (row.totalExpense ?? null);

      return [{ employeeId, parsedValue, invalid, changed }];
    });
  }, [editedValues, rows]);

  const hasInvalidEdit = dirtyEntries.some((entry) => entry.invalid);
  const changedEntries = dirtyEntries.filter((entry) => entry.changed);

  const {
    run: saveAll,
    loading: saving,
    errorMessage: saveErrorMessage,
  } = useAsyncAction(async () => {
    const employeeExpenseUpdate: EmployeeExpenseUpdate[] = changedEntries.map((entry) => ({
      employeeId: entry.employeeId,
      totalExpense: entry.parsedValue,
    }));

    await payrollReportApi.v1UpdateEmployeeExpensesBatch({
      clientId: clientId!,
      payPeriodId: payPeriodId!,
      employeeExpenseUpdate,
    });

    refetchPayrollReport();
    setEditedValues({});
  }, 'Failed to save employee expenses.');

  const handleEditValue = (employeeId: string, value: string) => {
    setEditedValues((previous) => ({ ...previous, [employeeId]: value }));
  };

  const handleBlurValue = (employeeId: string) => {
    setEditedValues((previous) => {
      const rawValue = previous[employeeId];
      if (rawValue === undefined) return previous;

      const trimmedValue = rawValue.trim();
      if (trimmedValue === '') return previous;

      const parsedValue = Number(trimmedValue);
      if (Number.isNaN(parsedValue)) return previous;

      return { ...previous, [employeeId]: parsedValue.toFixed(2) };
    });
  };

  const renderBody = () => {
    if (payrollReportErrorMessage) {
      return <Typography color="error">{payrollReportErrorMessage}</Typography>;
    }

    if (payrollReportLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!payrollReport || Object.keys(payrollReport).length === 0) {
      return <Typography color="text.secondary">No payroll report has been generated for this pay period.</Typography>;
    }

    return (
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="flex-end">
          <Button variant="contained" onClick={saveAll} disabled={changedEntries.length === 0 || hasInvalidEdit || saving} loading={saving}>
            Save All
          </Button>
        </Stack>
        {saveErrorMessage && <Typography color="error">{saveErrorMessage}</Typography>}
        <PayrollReportTable rows={rows} editedValues={editedValues} onEditValue={handleEditValue} onBlurValue={handleBlurValue} />
      </Stack>
    );
  };

  return (
    <DashboardCard id="payroll-report-page" header="Payroll Report" configPath={null}>
      {renderBody()}
    </DashboardCard>
  );
};

export default PayrollReportPage;
