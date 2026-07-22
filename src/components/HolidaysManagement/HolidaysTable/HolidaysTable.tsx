import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import type { Holiday } from '@/api/generated/models/Holiday';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import formatUTCDateMedium from '@/utils/formatUTCDateMedium';
import useTableSort from '@/hooks/useTableSort';

type Props = {
  holidays: Holiday[];
  onDelete: (holiday: Holiday) => void;
  onEdit: (holiday: Holiday) => void;
};

type SortKey = 'name' | 'date';

const HolidaysTable = ({ holidays, onDelete, onEdit }: Props) => {
  const { sortedItems: sortedHolidays, sortableHeader } = useTableSort<Holiday, SortKey>(
    holidays,
    {
      name: (left, right) => (left.holidayName ?? '').localeCompare(right.holidayName ?? '', undefined, { sensitivity: 'base' }),
      date: (left, right) => (left.holidayDate?.getTime() ?? Number.POSITIVE_INFINITY) - (right.holidayDate?.getTime() ?? Number.POSITIVE_INFINITY),
    },
    'date',
  );

  return (
    <ManagementTable headers={[sortableHeader('name', 'Holiday'), sortableHeader('date', 'Date'), { label: 'Actions', align: 'right' }]}>
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
