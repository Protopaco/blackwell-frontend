import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { FundingSource } from '@/api/generated/models/FundingSource';
import type { AllocationFormRow } from './AllocationFormRow';

type Props = {
  allocationTotal: number;
  allocationRequired: boolean;
  allocations: AllocationFormRow[];
  duplicateAllocation: boolean;
  fundingSources: FundingSource[];
  invalidAllocationPercentage: boolean;
  invalidAllocationTotal: boolean;
  missingFundingSources: boolean;
  onAddAllocation: () => void;
  onRemoveAllocation: (index: number) => void;
  onUpdateAllocation: (index: number, allocation: AllocationFormRow) => void;
  saving: boolean;
  selectedFundingSourceNames: string[];
  submitted: boolean;
};

const FundingAllocationFields = ({
  allocationTotal,
  allocationRequired,
  allocations,
  duplicateAllocation,
  fundingSources,
  invalidAllocationPercentage,
  invalidAllocationTotal,
  missingFundingSources,
  onAddAllocation,
  onRemoveAllocation,
  onUpdateAllocation,
  saving,
  selectedFundingSourceNames,
  submitted,
}: Props) => {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Funding allocation</Typography>
      {allocations.map((allocation, index) => {
        const availableFundingSources = fundingSources.filter(
          (fundingSource) =>
            fundingSource.fundingSourceName === allocation.fundingSourceName ||
            !selectedFundingSourceNames.includes(fundingSource.fundingSourceName ?? ''),
        );

        const percentageInvalid =
          submitted && (allocation.percentage === '' || Number.isNaN(Number(allocation.percentage)) || Number(allocation.percentage) < 0);

        return (
          <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
            <TextField
              disabled={saving}
              error={submitted && !allocation.fundingSourceName}
              helperText={submitted && !allocation.fundingSourceName ? 'Funding source is required.' : undefined}
              label="Funding source"
              onChange={(event) => onUpdateAllocation(index, { ...allocation, fundingSourceName: event.target.value })}
              select
              sx={{ flex: 1 }}
              value={allocation.fundingSourceName}
            >
              {availableFundingSources.map((fundingSource) => (
                <MenuItem key={fundingSource.fundingSourceId ?? fundingSource.fundingSourceName ?? ''} value={fundingSource.fundingSourceName ?? ''}>
                  {fundingSource.fundingSourceName}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled={saving}
              error={percentageInvalid}
              helperText={percentageInvalid ? 'Percentage must be zero or greater.' : undefined}
              label="Percentage"
              onChange={(event) => onUpdateAllocation(index, { ...allocation, percentage: event.target.value })}
              sx={{ width: 140 }}
              value={allocation.percentage}
            />
            <IconButton aria-label="Remove funding allocation" disabled={saving || allocations.length <= 1} onClick={() => onRemoveAllocation(index)} sx={{ mt: 1 }} size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        );
      })}
      <Typography color={invalidAllocationTotal ? 'error' : 'text.secondary'} variant="body2">
        Total: {allocationTotal.toFixed(2)}%
      </Typography>
      <Button disabled={saving || allocations.length >= 3 || fundingSources.length <= allocations.length} onClick={onAddAllocation} startIcon={<AddIcon />} variant="text">
        Add funding source
      </Button>
      {missingFundingSources ? (
        <Typography color="error" variant="body2">
          At least one funding source must be configured before creating an activity.
        </Typography>
      ) : null}
      {allocationRequired ? (
        <Typography color="error" variant="body2">
          Each allocation needs a funding source.
        </Typography>
      ) : null}
      {duplicateAllocation ? (
        <Typography color="error" variant="body2">
          Funding sources cannot be selected more than once.
        </Typography>
      ) : null}
      {invalidAllocationPercentage ? (
        <Typography color="error" variant="body2">
          Funding allocation percentages must be zero or greater.
        </Typography>
      ) : null}
      {invalidAllocationTotal ? (
        <Typography color="error" variant="body2">
          Funding allocations must total 100%.
        </Typography>
      ) : null}
    </Stack>
  );
};

export default FundingAllocationFields;
