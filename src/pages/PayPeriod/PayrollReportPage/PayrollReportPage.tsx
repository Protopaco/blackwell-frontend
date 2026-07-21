import { useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
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
import allocationReportGenerated from '@/models/allocationReportGenerated';
import payrollReportGenerated from '@/models/payrollReportGenerated';
import type { PayPeriodLayoutContext } from '@/pages/PayPeriod/PayPeriodLayout/PayPeriodLayout';

const PayrollReportPage = () => {
  const { clientId, payPeriodId } = useParams<{ clientId: string; payPeriodId: string }>();
  const { payPeriod, refetchPayPeriod } = useOutletContext<PayPeriodLayoutContext>();
  const key = clientId && payPeriodId ? `${clientId}/${payPeriodId}` : undefined;
  // Includes payPeriod.status so this re-fetches (or starts skipping) the moment the status that
  // gates payroll-report existence changes, without a separate manual refetch call.
  const payrollReportKey = key ? `${key}/${payPeriod.status}` : undefined;

  const {
    data: payrollReport,
    errorMessage: payrollReportErrorMessage,
    loading: payrollReportLoading,
    refetch: refetchPayrollReport,
  } = useFetchByKey(
    payrollReportKey,
    () => (payrollReportGenerated(payPeriod.status) ? payrollReportApi.v1GetPayrollReport({ clientId: clientId!, payPeriodId: payPeriodId! }) : Promise.resolve(null)),
    'Failed to load payroll report.'
  );

  const allocationReportExists = allocationReportGenerated(payPeriod.status);

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

  const allExpensesComplete = rows.every((row) => row.totalExpense !== null && row.totalExpense !== undefined);

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

  const {
    run: generateAllocationReport,
    loading: generatingAllocationReport,
    errorMessage: generateAllocationReportErrorMessage,
  } = useAsyncAction(async () => {
    await payrollReportApi.v1GenerateAllocationReport({ clientId: clientId!, payPeriodId: payPeriodId! });
    refetchPayPeriod();
  }, 'Failed to generate allocation report.');

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
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          {!allocationReportExists && (
            <Button
              variant="outlined"
              onClick={generateAllocationReport}
              disabled={saving || generatingAllocationReport || Object.keys(editedValues).length > 0 || !allExpensesComplete}
              loading={generatingAllocationReport}
            >
              Generate Allocation Report
            </Button>
          )}
          <Button variant="contained" onClick={saveAll} disabled={changedEntries.length === 0 || hasInvalidEdit || saving} loading={saving}>
            Save All
          </Button>
        </Stack>
        {saveErrorMessage && <Typography color="error">{saveErrorMessage}</Typography>}
        {generateAllocationReportErrorMessage && <Typography color="error">{generateAllocationReportErrorMessage}</Typography>}
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
