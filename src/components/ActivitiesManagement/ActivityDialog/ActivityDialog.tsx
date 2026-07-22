import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import Stack from '@mui/material/Stack';
import {
  ActivityPayRateEnum,
  ActivityPayrollCategoryEnum,
} from '@/api/generated/models/Activity';
import type {
  Activity,
  ActivityPayRateEnum as ActivityPayRate,
  ActivityPayrollCategoryEnum as ActivityPayrollCategory,
} from '@/api/generated/models/Activity';
import type { FundingSource } from '@/api/generated/models/FundingSource';
import ManagementDialog from '@/components/Shared/ManagementDialog/ManagementDialog';
import currencyToString from '@/utils/currencyToString';
import { isFlatPayRate } from '../activityDisplay';
import ActivityDetailsFields from './ActivityDetailsFields';
import FundingAllocationFields from './FundingAllocationFields';
import type { AllocationFormRow } from './AllocationFormRow';

type Props = {
  activity: Activity | null;
  errorMessage: string | null;
  fundingSources: FundingSource[];
  formId: string;
  onClose: () => void;
  onSave: (activity: Activity) => void;
  open: boolean;
  saving: boolean;
  submitLabel: string;
  title: string;
};

const defaultAllocationRows = (fundingSources: FundingSource[]): AllocationFormRow[] => [
  { fundingSourceName: fundingSources[0]?.fundingSourceName ?? '', percentage: '100.00' },
];

const calculateAllocationTotal = (allocations: AllocationFormRow[]) => {
  const total = allocations.reduce((sum, allocation) => sum + Number(allocation.percentage || 0), 0);
  return Math.round(total * 100) / 100;
};

const ActivityDialog = ({ activity, errorMessage, fundingSources, formId, onClose, onSave, open, saving, submitLabel, title }: Props) => {
  const [activityName, setActivityName] = useState('');
  const [trackSeparately, setTrackSeparately] = useState(false);
  const [payrollCategory, setPayrollCategory] = useState<ActivityPayrollCategory>(ActivityPayrollCategoryEnum.Regular);
  const [payRate, setPayRate] = useState<ActivityPayRate>(ActivityPayRateEnum.HourlyPayRate1);
  const [flatRateAmount, setFlatRateAmount] = useState('');
  const [allocations, setAllocations] = useState<AllocationFormRow[]>(defaultAllocationRows(fundingSources));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;

    setActivityName(activity?.activityName ?? '');
    setTrackSeparately(activity?.trackSeparately ?? false);
    setPayrollCategory(activity?.payrollCategory ?? ActivityPayrollCategoryEnum.Regular);
    setPayRate(activity?.payRate ?? ActivityPayRateEnum.HourlyPayRate1);
    setFlatRateAmount(currencyToString(activity?.flatRateAmount));
    setAllocations(
      activity?.fundingSources?.length
        ? activity.fundingSources.map((fundingSource) => ({
            fundingSourceName: fundingSource.fundingSourceName ?? '',
            percentage: currencyToString(fundingSource.percentage),
          }))
        : defaultAllocationRows(fundingSources),
    );
    setSubmitted(false);
  }, [activity, fundingSources, open]);

  const allocationTotal = useMemo(() => calculateAllocationTotal(allocations), [allocations]);
  const flatRateSelected = isFlatPayRate(payRate);

  const selectedFundingSourceNames = allocations.map((allocation) => allocation.fundingSourceName).filter(Boolean);

  const updateAllocation = (index: number, nextAllocation: AllocationFormRow) => {
    setAllocations((currentAllocations) => currentAllocations.map((allocation, allocationIndex) => (allocationIndex === index ? nextAllocation : allocation)));
  };

  const addAllocation = () => {
    setAllocations((currentAllocations) => {
      if (currentAllocations.length >= 3) return currentAllocations;

      const currentFundingSourceNames = currentAllocations.map((allocation) => allocation.fundingSourceName).filter(Boolean);
      const availableFundingSource = fundingSources.find((fundingSource) => !currentFundingSourceNames.includes(fundingSource.fundingSourceName ?? ''));

      return [...currentAllocations, { fundingSourceName: availableFundingSource?.fundingSourceName ?? '', percentage: '0.00' }];
    });
  };

  const removeAllocation = (index: number) => {
    setAllocations((currentAllocations) => {
      if (currentAllocations.length <= 1) return currentAllocations;
      return currentAllocations.filter((_, allocationIndex) => allocationIndex !== index);
    });
  };

  const saveActivity = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setSubmitted(true);

    const trimmedActivityName = activityName.trim();
    const parsedFlatRateAmount = Number(flatRateAmount);
    const hasDuplicateFundingSources = new Set(selectedFundingSourceNames).size !== selectedFundingSourceNames.length;
    const hasMissingFundingSource = allocations.some((allocation) => !allocation.fundingSourceName);
    const hasInvalidPercentage = allocations.some((allocation) => {
      const percentage = Number(allocation.percentage);
      return allocation.percentage === '' || Number.isNaN(percentage) || percentage < 0;
    });
    const hasInvalidTotal = allocationTotal !== 100;

    if (
      !trimmedActivityName ||
      fundingSources.length === 0 ||
      allocations.length === 0 ||
      hasMissingFundingSource ||
      hasDuplicateFundingSources ||
      hasInvalidPercentage ||
      hasInvalidTotal ||
      (flatRateSelected && (flatRateAmount === '' || Number.isNaN(parsedFlatRateAmount)))
    ) {
      return;
    }

    onSave({
      activityId: activity?.activityId,
      activityName: trimmedActivityName,
      trackSeparately,
      payrollCategory,
      payRate,
      flatRateAmount: flatRateSelected ? parsedFlatRateAmount : 0,
      fundingSources: allocations.map((allocation) => ({
        fundingSourceName: allocation.fundingSourceName,
        percentage: Number(allocation.percentage),
      })),
    });
  };

  const nameRequired = submitted && !activityName.trim();
  const flatRateAmountInvalid = submitted && flatRateSelected && (flatRateAmount === '' || Number.isNaN(Number(flatRateAmount)));
  const missingFundingSources = submitted && fundingSources.length === 0;
  const allocationRequired = submitted && allocations.some((allocation) => !allocation.fundingSourceName);
  const duplicateAllocation = submitted && new Set(selectedFundingSourceNames).size !== selectedFundingSourceNames.length;
  const invalidAllocationPercentage =
    submitted &&
    allocations.some((allocation) => {
      const percentage = Number(allocation.percentage);
      return allocation.percentage === '' || Number.isNaN(percentage) || percentage < 0;
    });
  const invalidAllocationTotal = allocationTotal !== 100;

  return (
    <ManagementDialog
      errorMessage={errorMessage}
      formId={formId}
      onClose={onClose}
      open={open}
      saving={saving}
      submitDisabled={invalidAllocationTotal}
      submitLabel={submitLabel}
      title={title}
    >
      <Stack component="form" id={formId} spacing={2} onSubmit={saveActivity} noValidate>
        <ActivityDetailsFields
          activityName={activityName}
          flatRateAmount={flatRateAmount}
          flatRateAmountInvalid={flatRateAmountInvalid}
          nameRequired={nameRequired}
          onActivityNameChange={setActivityName}
          onFlatRateAmountChange={setFlatRateAmount}
          onPayRateChange={setPayRate}
          onPayrollCategoryChange={setPayrollCategory}
          onTrackSeparatelyChange={setTrackSeparately}
          payRate={payRate}
          payrollCategory={payrollCategory}
          saving={saving}
          trackSeparately={trackSeparately}
        />
        <FundingAllocationFields
          allocationRequired={allocationRequired}
          allocations={allocations}
          duplicateAllocation={duplicateAllocation}
          fundingSources={fundingSources}
          invalidAllocationTotal={invalidAllocationTotal}
          invalidAllocationPercentage={invalidAllocationPercentage}
          missingFundingSources={missingFundingSources}
          onAddAllocation={addAllocation}
          onRemoveAllocation={removeAllocation}
          onUpdateAllocation={updateAllocation}
          allocationTotal={allocationTotal}
          saving={saving}
          selectedFundingSourceNames={selectedFundingSourceNames}
          submitted={submitted}
        />
      </Stack>
    </ManagementDialog>
  );
};

export default ActivityDialog;
