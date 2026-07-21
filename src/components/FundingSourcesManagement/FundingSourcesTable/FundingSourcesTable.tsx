import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import type { FundingSource } from '@/api/generated/models/FundingSource';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import useTableSort from '@/hooks/useTableSort';

type Props = {
  fundingSources: FundingSource[];
  onDelete: (fundingSource: FundingSource) => void;
  onEdit: (fundingSource: FundingSource) => void;
};

type SortKey = 'name' | 'code';

const FundingSourcesTable = ({ fundingSources, onDelete, onEdit }: Props) => {
  const { sortedItems: sortedFundingSources, sortableHeader } = useTableSort<FundingSource, SortKey>(
    fundingSources,
    {
      name: (left, right) => (left.fundingSourceName ?? '').localeCompare(right.fundingSourceName ?? '', undefined, { sensitivity: 'base' }),
      code: (left, right) => (left.fundingSourceCode ?? '').localeCompare(right.fundingSourceCode ?? '', undefined, { sensitivity: 'base' }),
    },
    'name',
  );

  return (
    <ManagementTable headers={[sortableHeader('name', 'Funding Source'), sortableHeader('code', 'Code'), { label: 'Actions', align: 'right' }]}>
      {sortedFundingSources.map((fundingSource) => (
        <TableRow key={fundingSource.fundingSourceId ?? fundingSource.fundingSourceName ?? ''}>
          <TableCell>{fundingSource.fundingSourceName}</TableCell>
          <TableCell>{fundingSource.fundingSourceCode}</TableCell>
          <TableCell align="right">
            <IconButton aria-label={`Edit ${fundingSource.fundingSourceName ?? 'funding source'}`} onClick={() => onEdit(fundingSource)} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label={`Delete ${fundingSource.fundingSourceName ?? 'funding source'}`} onClick={() => onDelete(fundingSource)} size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </ManagementTable>
  );
};

export default FundingSourcesTable;
