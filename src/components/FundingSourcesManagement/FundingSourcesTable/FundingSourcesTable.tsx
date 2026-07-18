import { useMemo, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import type { FundingSource } from '@/api/generated/models/FundingSource';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';

type Props = {
  fundingSources: FundingSource[];
  onEdit: (fundingSource: FundingSource) => void;
};

type SortKey = 'name' | 'code';

type SortDirection = 'asc' | 'desc';

const FundingSourcesTable = ({ fundingSources, onEdit }: Props) => {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedFundingSources = useMemo(() => {
    return [...fundingSources].sort((left, right) => {
      const directionMultiplier = sortDirection === 'asc' ? 1 : -1;

      switch (sortKey) {
        case 'code':
          return directionMultiplier * (left.fundingSourceCode ?? '').localeCompare(right.fundingSourceCode ?? '', undefined, { sensitivity: 'base' });
        case 'name':
        default:
          return directionMultiplier * (left.fundingSourceName ?? '').localeCompare(right.fundingSourceName ?? '', undefined, { sensitivity: 'base' });
      }
    });
  }, [fundingSources, sortDirection, sortKey]);

  const updateSort = (nextSortKey: SortKey) => {
    if (nextSortKey === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection('asc');
  };

  return (
    <ManagementTable
      headers={[
        { label: 'Funding Source', sortDirection: sortKey === 'name' ? sortDirection : undefined, onSort: () => updateSort('name') },
        { label: 'Code', sortDirection: sortKey === 'code' ? sortDirection : undefined, onSort: () => updateSort('code') },
        { label: 'Actions', align: 'right' },
      ]}
    >
      {sortedFundingSources.map((fundingSource) => (
        <TableRow key={fundingSource.fundingSourceId ?? fundingSource.fundingSourceName ?? ''}>
          <TableCell>{fundingSource.fundingSourceName}</TableCell>
          <TableCell>{fundingSource.fundingSourceCode}</TableCell>
          <TableCell align="right">
            <IconButton aria-label={`Edit ${fundingSource.fundingSourceName ?? 'funding source'}`} onClick={() => onEdit(fundingSource)} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </ManagementTable>
  );
};

export default FundingSourcesTable;
