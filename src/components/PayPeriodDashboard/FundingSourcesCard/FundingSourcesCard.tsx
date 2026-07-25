import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import type { FundingSource } from '@/api/generated/models/FundingSource';
import DashboardCard from '@/components/Shared/DashboardCard/DashboardCard';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import useTableSort from '@/hooks/useTableSort';

type Props = {
  fundingSources: FundingSource[];
};

type SortKey = 'name' | 'code';

const FundingSourcesCard = ({ fundingSources }: Props) => {
  const { sortedItems: sortedFundingSources, sortableHeader } = useTableSort<FundingSource, SortKey>(
    fundingSources,
    {
      name: (left, right) => (left.fundingSourceName ?? '').localeCompare(right.fundingSourceName ?? '', undefined, { sensitivity: 'base' }),
      code: (left, right) => (left.fundingSourceCode ?? '').localeCompare(right.fundingSourceCode ?? '', undefined, { sensitivity: 'base' }),
    },
    'name',
  );

  return (
    <DashboardCard id="funding-sources-card" header="Funding Sources" configPath={null}>
      <ManagementTable headers={[sortableHeader('name', 'Funding Source'), sortableHeader('code', 'Code')]}>
        {sortedFundingSources.map((fundingSource) => (
          <TableRow key={fundingSource.fundingSourceId ?? fundingSource.fundingSourceName ?? ''}>
            <TableCell>{fundingSource.fundingSourceName}</TableCell>
            <TableCell>{fundingSource.fundingSourceCode}</TableCell>
          </TableRow>
        ))}
      </ManagementTable>
    </DashboardCard>
  );
};

export default FundingSourcesCard;
