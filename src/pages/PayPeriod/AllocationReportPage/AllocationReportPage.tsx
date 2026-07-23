import { useEffect, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { payPeriodApi, payrollReportApi } from '@/api/client';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import DeleteConfirmationDialog from '@/components/Shared/DeleteConfirmationDialog/DeleteConfirmationDialog';
import AllocationReportTable from '@/components/PayPeriod/AllocationReportTable/AllocationReportTable';
import AdditionalExpensesEditor from '@/components/PayPeriod/AdditionalExpensesEditor/AdditionalExpensesEditor';
import type { AdditionalExpenseFormRow } from '@/components/PayPeriod/AdditionalExpensesEditor/AdditionalExpenseFormRow';
import type { AdditionalExpense } from '@/api/generated/models/AdditionalExpense';
import type { AllocationReportRow } from '@/api/generated/models/AllocationReportRow';
import { PayPeriodStatusEnum } from '@/api/generated/models/PayPeriod';
import useAsyncAction from '@/hooks/useAsyncAction';
import useFetchByKey from '@/hooks/useFetchByKey';
import allocationReportGenerated from '@/models/allocationReportGenerated';
import currencyToString from '@/utils/currencyToString';
import type { PayPeriodLayoutContext } from '@/pages/PayPeriod/PayPeriodLayout/PayPeriodLayout';

const toFormRows = (expenses: AdditionalExpense[]): AdditionalExpenseFormRow[] =>
  expenses.map((expense) => ({ expenseName: expense.expenseName ?? '', amount: currencyToString(expense.amount ?? undefined) }));

const evaluateRow = (row: AdditionalExpenseFormRow) => {
  const trimmedName = row.expenseName.trim();
  const trimmedAmount = row.amount.trim();

  if (trimmedName === '' && trimmedAmount === '') {
    return { nameInvalid: false, amountInvalid: false };
  }

  const parsedAmount = Number(trimmedAmount);

  return {
    nameInvalid: trimmedName === '',
    amountInvalid: trimmedAmount === '' || Number.isNaN(parsedAmount) || parsedAmount < 0,
  };
};

const AllocationReportPage = () => {
  const { clientId, payPeriodId } = useParams<{ clientId: string; payPeriodId: string }>();
  const { payPeriod, refetchPayPeriod } = useOutletContext<PayPeriodLayoutContext>();
  const key = clientId && payPeriodId ? `${clientId}/${payPeriodId}` : undefined;
  // Includes payPeriod.status so this re-fetches the moment allocation report existence changes.
  const allocationReportKey = key ? `${key}/${payPeriod.status}` : undefined;
  const allocationReportExists = allocationReportGenerated(payPeriod.status);

  const {
    data: allocationReport,
    errorMessage: allocationReportErrorMessage,
    loading: allocationReportLoading,
    refetch: refetchAllocationReport,
  } = useFetchByKey(
    allocationReportKey,
    () => payrollReportApi.v1GetAllocationReport({ clientId: clientId!, payPeriodId: payPeriodId! }),
    'Failed to load allocation report.'
  );

  const {
    data: additionalExpenses,
    errorMessage: additionalExpensesErrorMessage,
    loading: additionalExpensesLoading,
    refetch: refetchAdditionalExpenses,
  } = useFetchByKey(
    key,
    () => payrollReportApi.v1GetAdditionalExpenses({ clientId: clientId!, payPeriodId: payPeriodId! }),
    'Failed to load additional expenses.'
  );

  const [expenseRows, setExpenseRows] = useState<AdditionalExpenseFormRow[]>([]);

  useEffect(() => {
    if (additionalExpenses === null) return;
    setExpenseRows(toFormRows(additionalExpenses));
  }, [additionalExpenses]);

  const savedExpenseRows = useMemo(() => toFormRows(additionalExpenses ?? []), [additionalExpenses]);
  const expensesDirty = JSON.stringify(expenseRows) !== JSON.stringify(savedExpenseRows);
  const hasInvalidExpense = expenseRows.some((row) => {
    const { nameInvalid, amountInvalid } = evaluateRow(row);
    return nameInvalid || amountInvalid;
  });

  const rows = useMemo((): AllocationReportRow[] => {
    if (!allocationReport) return [];

    return [...allocationReport].sort((left, right) =>
      (left.fundingSourceName ?? '').localeCompare(right.fundingSourceName ?? '', undefined, { sensitivity: 'base' })
    );
  }, [allocationReport]);

  const {
    run: saveAdditionalExpenses,
    loading: savingAdditionalExpenses,
    errorMessage: saveAdditionalExpensesErrorMessage,
  } = useAsyncAction(async () => {
    const additionalExpense = expenseRows
      .filter((row) => row.expenseName.trim() !== '' && row.amount.trim() !== '')
      .map((row) => ({ expenseName: row.expenseName.trim(), amount: Number(row.amount.trim()) }));

    await payrollReportApi.v1UpdateAdditionalExpenses({ clientId: clientId!, payPeriodId: payPeriodId!, additionalExpense });
    refetchAdditionalExpenses();

    if (allocationReportExists) {
      try {
        await payrollReportApi.v1GenerateAllocationReport({ clientId: clientId!, payPeriodId: payPeriodId! });
        refetchAllocationReport();
      } catch (error) {
        console.error('Failed to auto-regenerate allocation report.', error);
      }
    }
  }, 'Failed to save additional expenses.', 'Additional expenses saved.');

  const handleChangeRow = (index: number, nextRow: AdditionalExpenseFormRow) => {
    setExpenseRows((current) => current.map((row, rowIndex) => (rowIndex === index ? nextRow : row)));
  };

  const handleBlurAmount = (index: number) => {
    setExpenseRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, amount: currencyToString(row.amount) } : row)));
  };

  const handleAddRow = () => {
    setExpenseRows((current) => [...current, { expenseName: '', amount: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    setExpenseRows((current) => current.filter((_, rowIndex) => rowIndex !== index));
  };

  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const payPeriodClosed = payPeriod.status === PayPeriodStatusEnum.Closed;

  const handleRefresh = () => {
    refetchPayPeriod();
    refetchAllocationReport();
    refetchAdditionalExpenses();
  };

  const {
    run: closePayPeriod,
    loading: closingPayPeriod,
    errorMessage: closePayPeriodErrorMessage,
  } = useAsyncAction(async () => {
    await payPeriodApi.v1ClosePayPeriod({ clientId: clientId!, payPeriodId: payPeriodId! });
    refetchPayPeriod();
    setCloseDialogOpen(false);
  }, 'Failed to close pay period.', 'Pay period closed.');

  const renderAllocationReport = () => {
    if (allocationReportErrorMessage) {
      return <Typography color="error">{allocationReportErrorMessage}</Typography>;
    }

    if (allocationReportLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (rows.length === 0) {
      return <Typography color="text.secondary">No allocation report has been generated for this pay period.</Typography>;
    }

    return <AllocationReportTable rows={rows} />;
  };

  const renderAdditionalExpenses = () => {
    if (additionalExpensesErrorMessage) {
      return <Typography color="error">{additionalExpensesErrorMessage}</Typography>;
    }

    if (additionalExpensesLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <AdditionalExpensesEditor
        errorMessage={saveAdditionalExpensesErrorMessage}
        evaluateRow={evaluateRow}
        onAddRow={handleAddRow}
        onBlurAmount={handleBlurAmount}
        onChangeRow={handleChangeRow}
        onRemoveRow={handleRemoveRow}
        onSave={saveAdditionalExpenses}
        rows={expenseRows}
        saveDisabled={!expensesDirty || hasInvalidExpense || savingAdditionalExpenses}
        saving={savingAdditionalExpenses}
      />
    );
  };

  return (
    <DashboardCard id="allocation-report-page" header="Allocation Report" configPath={null}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="outlined" onClick={handleRefresh} disabled={allocationReportLoading || additionalExpensesLoading}>
            Refresh
          </Button>
          {!payPeriodClosed && (
            <Button variant="outlined" color="error" onClick={() => setCloseDialogOpen(true)} disabled={!allocationReportExists || closingPayPeriod}>
              Close Pay Period
            </Button>
          )}
        </Stack>
        {renderAllocationReport()}
        <Divider />
        {renderAdditionalExpenses()}
      </Stack>
      <DeleteConfirmationDialog
        body="This will mark the pay period as closed. You can keep viewing the reports, but this is the final step in the pay period workflow."
        confirmLabel="Close Pay Period"
        errorMessage={closePayPeriodErrorMessage}
        onClose={() => setCloseDialogOpen(false)}
        onConfirm={closePayPeriod}
        open={closeDialogOpen}
        saving={closingPayPeriod}
        title="Close pay period?"
      />
    </DashboardCard>
  );
};

export default AllocationReportPage;
