import { useEffect, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { payrollReportApi } from '@/api/client';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import AllocationReportTable from '@/components/PayPeriod/AllocationReportTable/AllocationReportTable';
import AdditionalExpensesEditor from '@/components/PayPeriod/AdditionalExpensesEditor/AdditionalExpensesEditor';
import type { AdditionalExpenseFormRow } from '@/components/PayPeriod/AdditionalExpensesEditor/AdditionalExpenseFormRow';
import type { AdditionalExpense } from '@/api/generated/models/AdditionalExpense';
import type { AllocationReportRow } from '@/api/generated/models/AllocationReportRow';
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
  const { payPeriod } = useOutletContext<PayPeriodLayoutContext>();
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
  }, 'Failed to save additional expenses.');

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
        {renderAllocationReport()}
        <Divider />
        {renderAdditionalExpenses()}
      </Stack>
    </DashboardCard>
  );
};

export default AllocationReportPage;
