import { useMemo, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import type { Holiday } from '@/api/generated/models/Holiday';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import formatUTCDateMedium from '@/utils/formatUTCDateMedium';

type Props = {
  holidays: Holiday[];
  onDelete: (holiday: Holiday) => void;
  onEdit: (holiday: Holiday) => void;
};

type SortKey = 'name' | 'date';

type SortDirection = 'asc' | 'desc';

const HolidaysTable = ({ holidays, onDelete, onEdit }: Props) => {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedHolidays = useMemo(() => {
    return [...holidays].sort((left, right) => {
      const directionMultiplier = sortDirection === 'asc' ? 1 : -1;

      switch (sortKey) {
        case 'name':
          return directionMultiplier * (left.holidayName ?? '').localeCompare(right.holidayName ?? '', undefined, { sensitivity: 'base' });
        case 'date':
        default:
          return directionMultiplier * ((left.holidayDate?.getTime() ?? Number.POSITIVE_INFINITY) - (right.holidayDate?.getTime() ?? Number.POSITIVE_INFINITY));
      }
    });
  }, [holidays, sortDirection, sortKey]);

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
        { label: 'Holiday', sortDirection: sortKey === 'name' ? sortDirection : undefined, onSort: () => updateSort('name') },
        { label: 'Date', sortDirection: sortKey === 'date' ? sortDirection : undefined, onSort: () => updateSort('date') },
        { label: 'Actions', align: 'right' },
      ]}
    >
      {sortedHolidays.map((holiday) => (
        <TableRow key={holiday.holidayId ?? `${holiday.holidayName}-${holiday.holidayDate?.toISOString() ?? ''}`}>
          <TableCell>{holiday.holidayName}</TableCell>
          <TableCell>{formatUTCDateMedium(holiday.holidayDate)}</TableCell>
          <TableCell align="right">
            <IconButton aria-label={`Edit ${holiday.holidayName ?? 'holiday'}`} onClick={() => onEdit(holiday)} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label={`Delete ${holiday.holidayName ?? 'holiday'}`} onClick={() => onDelete(holiday)} size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </ManagementTable>
  );
};

export default HolidaysTable;
