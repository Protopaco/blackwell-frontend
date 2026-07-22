import { useState } from 'react';
import type { TablePaginationProps } from '@mui/material/TablePagination';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

type UseTablePaginationResult<T> = {
  pageItems: T[];
  paginationProps: Pick<
    TablePaginationProps,
    'count' | 'page' | 'rowsPerPage' | 'onPageChange' | 'onRowsPerPageChange' | 'rowsPerPageOptions'
  >;
};

/**
 * Owns page/rowsPerPage state and slices `items` to the current page. Resets to
 * page 1 whenever the item count changes (e.g. a filter removes rows) — a pure
 * re-sort (same count, different order) intentionally does not reset the page.
 */
const useTablePagination = <T>(items: T[], options?: { defaultRowsPerPage?: number }): UseTablePaginationResult<T> => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(options?.defaultRowsPerPage ?? 25);
  const [lastItemCount, setLastItemCount] = useState(items.length);

  if (items.length !== lastItemCount) {
    setLastItemCount(items.length);
    setPage(0);
  }

  const pageItems = items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return {
    pageItems,
    paginationProps: {
      count: items.length,
      page,
      rowsPerPage,
      rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
      onPageChange: (_event, nextPage) => setPage(nextPage),
      onRowsPerPageChange: (event) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
      },
    },
  };
};

export default useTablePagination;
