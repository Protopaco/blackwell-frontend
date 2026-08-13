import { useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();
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

  const [editedWageValues, setEditedWageValues] = useState<Record<string, string>>({});
  const [editedTaxValues, setEditedTaxValues] = useState<Record<string, string>>({});

  const rows = useMemo((): PayrollReportRow[] => {
    if (!payrollReport) return [];

    return Object.entries(payrollReport)
      .map(([employeeId, report]) => ({
        employeeId,
        employeeName: report.employeeName ?? '',
        totalHours: report.totalHours ?? 0,
        totalFlatRate: report.totalFlatRate ?? 0,
        wageExpense: report.wageExpense ?? null,
        taxExpense: report.taxExpense ?? null,
        hourly: report.hourly ?? [],
        flatRate: report.flatRate ?? [],
      }))
      .sort((left, right) => left.employeeName.localeCompare(right.employeeName, undefined, { sensitivity: 'base' }));
  }, [payrollReport]);

  // Parses a raw text-field value into a currency number, or null when the field was cleared.
  const parseEditedValue = (rawValue: string): number | null => {
    const trimmedValue = rawValue.trim();
    return trimmedValue === '' ? null : Number(trimmedValue);
  };

  const dirtyEmployeeIds = useMemo(
    () => new Set([...Object.keys(editedWageValues), ...Object.keys(editedTaxValues)]),
    [editedWageValues, editedTaxValues],
  );

  const dirtyEntries = useMemo(() => {
    return [...dirtyEmployeeIds].flatMap((employeeId) => {
      const row = rows.find((candidate) => candidate.employeeId === employeeId);
      if (!row) return [];

      const rawWageValue = editedWageValues[employeeId];
      const rawTaxValue = editedTaxValues[employeeId];

      const wageInvalid = rawWageValue !== undefined && rawWageValue.trim() !== '' && Number.isNaN(parseEditedValue(rawWageValue));
      const taxInvalid = rawTaxValue !== undefined && rawTaxValue.trim() !== '' && Number.isNaN(parseEditedValue(rawTaxValue));
      const invalid = wageInvalid || taxInvalid;

      const wageExpense = rawWageValue !== undefined ? parseEditedValue(rawWageValue) : row.wageExpense;
      const taxExpense = rawTaxValue !== undefined ? parseEditedValue(rawTaxValue) : row.taxExpense;
      const changed = !invalid && (wageExpense !== row.wageExpense || taxExpense !== row.taxExpense);

      return [{ employeeId, wageExpense, taxExpense, invalid, changed }];
    });
  }, [dirtyEmployeeIds, editedWageValues, editedTaxValues, rows]);

  const hasInvalidEdit = dirtyEntries.some((entry) => entry.invalid);
  const changedEntries = dirtyEntries.filter((entry) => entry.changed);

  const allExpensesComplete = rows.every(
    (row) => row.wageExpense !== null && row.wageExpense !== undefined && row.taxExpense !== null && row.taxExpense !== undefined,
  );

  const handleRefresh = () => {
    refetchPayPeriod();
    refetchPayrollReport();
  };

  const {
    run: saveAll,
    loading: saving,
    errorMessage: saveErrorMessage,
  } = useAsyncAction(async () => {
    const employeeExpenseUpdate: EmployeeExpenseUpdate[] = changedEntries.map((entry) => ({
      employeeId: entry.employeeId,
      wageExpense: entry.wageExpense,
      taxExpense: entry.taxExpense,
    }));

    await payrollReportApi.v1UpdateEmployeeExpensesBatch({
      clientId: clientId!,
      payPeriodId: payPeriodId!,
      employeeExpenseUpdate,
    });

    refetchPayrollReport();
    setEditedWageValues({});
    setEditedTaxValues({});

    if (allocationReportExists) {
      try {
        await payrollReportApi.v1GenerateAllocationReport({ clientId: clientId!, payPeriodId: payPeriodId! });
        refetchPayPeriod();
      } catch (error) {
        console.error('Failed to auto-regenerate allocation report.', error);
      }
    }
  }, 'Failed to save employee expenses.', 'Employee expenses saved.');

  const {
    run: generateAllocationReport,
    loading: generatingAllocationReport,
    errorMessage: generateAllocationReportErrorMessage,
  } = useAsyncAction(async () => {
    await payrollReportApi.v1GenerateAllocationReport({ clientId: clientId!, payPeriodId: payPeriodId! });
    refetchPayPeriod();
    navigate(`/client/${clientId}/payPeriod/${payPeriodId}/allocationReport`);
  }, 'Failed to generate allocation report.', 'Allocation report generated.');

  const handleEditWageValue = (employeeId: string, value: string) => {
    setEditedWageValues((previous) => ({ ...previous, [employeeId]: value }));
  };

  const handleEditTaxValue = (employeeId: string, value: string) => {
    setEditedTaxValues((previous) => ({ ...previous, [employeeId]: value }));
  };

  // Reformats a text field's raw value to a fixed two-decimal string on blur, leaving it untouched
  // if it's empty or not a parseable number.
  const normalizeOnBlur = (previous: Record<string, string>, employeeId: string): Record<string, string> => {
    const rawValue = previous[employeeId];
    if (rawValue === undefined) return previous;

    const trimmedValue = rawValue.trim();
    if (trimmedValue === '') return previous;

    const parsedValue = Number(trimmedValue);
    if (Number.isNaN(parsedValue)) return previous;

    return { ...previous, [employeeId]: parsedValue.toFixed(2) };
  };

  const handleBlurWageValue = (employeeId: string) => {
    setEditedWageValues((previous) => normalizeOnBlur(previous, employeeId));
  };

  const handleBlurTaxValue = (employeeId: string) => {
    setEditedTaxValues((previous) => normalizeOnBlur(previous, employeeId));
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
        {saveErrorMessage && <Typography color="error">{saveErrorMessage}</Typography>}
        {generateAllocationReportErrorMessage && <Typography color="error">{generateAllocationReportErrorMessage}</Typography>}
        <PayrollReportTable
          rows={rows}
          editedWageValues={editedWageValues}
          editedTaxValues={editedTaxValues}
          onEditWageValue={handleEditWageValue}
          onEditTaxValue={handleEditTaxValue}
          onBlurWageValue={handleBlurWageValue}
          onBlurTaxValue={handleBlurTaxValue}
        />
      </Stack>
    );
  };

  const reportAvailable = !!payrollReport && Object.keys(payrollReport).length > 0;

  return (
    <DashboardCard id="payroll-report-page" header="Payroll Report" configPath={null}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="outlined" onClick={handleRefresh} disabled={payrollReportLoading}>
            Refresh
          </Button>
          {reportAvailable && !allocationReportExists && (
            <Button
              variant="outlined"
              onClick={generateAllocationReport}
              disabled={saving || generatingAllocationReport || dirtyEmployeeIds.size > 0 || !allExpensesComplete}
              loading={generatingAllocationReport}
            >
              Generate Allocation Report
            </Button>
          )}
          {reportAvailable && (
            <Button variant="contained" onClick={saveAll} disabled={changedEntries.length === 0 || hasInvalidEdit || saving} loading={saving}>
              Save All
            </Button>
          )}
        </Stack>
        {renderBody()}
      </Stack>
    </DashboardCard>
  );
};

export default PayrollReportPage;
