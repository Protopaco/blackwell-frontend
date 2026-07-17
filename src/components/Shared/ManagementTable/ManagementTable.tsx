import type { ReactNode } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';

type Header = {
  label: string;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  sortDirection?: 'asc' | 'desc';
  onSort?: () => void;
};

type Props = {
  headers: Header[];
  children: ReactNode;
};

const ManagementTable = ({ headers, children }: Props) => {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header.label} align={header.align} sortDirection={header.sortDirection}>
                {header.onSort ? (
                  <TableSortLabel active={Boolean(header.sortDirection)} direction={header.sortDirection ?? 'asc'} onClick={header.onSort}>
                    {header.label}
                  </TableSortLabel>
                ) : (
                  header.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default ManagementTable;
