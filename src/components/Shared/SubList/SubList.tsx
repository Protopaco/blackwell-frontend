import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

type Column<T> = {
  [K in keyof T]: { key: K; label: string; format?: (value: T[K]) => string };
}[keyof T];

type Props<T> = {
  entries: T[];
  columns: Column<T>[];
};

const SubList = <T,>({ entries, columns }: Props<T>) => {
  if (entries.length === 0) return null;

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={String(column.key)}>{column.label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {entries.map((entry, index) => (
          // eslint-disable-next-line react/no-array-index-key -- entries have no stable id, order is stable within a render
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={String(column.key)}>
                {column.format ? column.format(entry[column.key]) : String(entry[column.key])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SubList;
