import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination, { type TablePaginationProps } from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import type { ManagementTableHeader } from '@/models/ManagementTableHeader';

type Props = {
  headers: ManagementTableHeader[];
  children: ReactNode;
  pagination?: Pick<TablePaginationProps, 'count' | 'page' | 'rowsPerPage' | 'onPageChange' | 'onRowsPerPageChange' | 'rowsPerPageOptions'>;
};

// TableSortLabel treats its label + sort arrow as one box, so centering that box shifts the visible
// text off-center (the arrow is hidden until hover, but still reserves layout space). Centering on the
// text alone requires taking the arrow out of the layout flow and centering what's left.
const sortLabelJustifyContent: Record<NonNullable<ManagementTableHeader['align']>, string> = {
  inherit: 'flex-start',
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  justify: 'flex-start',
};

const ManagementTable = ({ headers, children, pagination }: Props) => {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header.label} align={header.align} sortDirection={header.sortDirection}>
                {header.onSort ? (
                  <Box sx={{ display: 'flex', justifyContent: sortLabelJustifyContent[header.align ?? 'left'] }}>
                    <TableSortLabel
                      active={Boolean(header.sortDirection)}
                      direction={header.sortDirection ?? 'asc'}
                      onClick={header.onSort}
                      sx={{
                        position: 'relative',
                        '& .MuiTableSortLabel-icon': {
                          position: 'absolute',
                          right: '-20px',
                          margin: 0,
                        },
                      }}
                    >
                      {header.label}
                    </TableSortLabel>
                  </Box>
                ) : (
                  header.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
        {pagination && (
          <TableFooter>
            <TableRow>
              <TablePagination {...pagination} />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default ManagementTable;
