import { useState } from 'react';
import type { ManagementTableHeader } from '@/models/ManagementTableHeader';

type SortDirection = 'asc' | 'desc';

type Comparator<T> = (left: T, right: T) => number;

type UseTableSortResult<T, K extends string> = {
  sortedItems: T[];
  sortableHeader: (key: K, label: string, align?: ManagementTableHeader['align']) => ManagementTableHeader;
};

/**
 * Owns the sort-state boilerplate (`sortKey`/`sortDirection`, asc/desc toggle
 * on repeat click) shared by every `ManagementTable` consumer. Callers supply
 * one ascending comparator per sort key; `sortableHeader` builds the header
 * shape `ManagementTable` expects.
 */
const useTableSort = <T, K extends string>(items: T[], comparators: Record<K, Comparator<T>>, defaultSortKey: K): UseTableSortResult<T, K> => {
  const [sortKey, setSortKey] = useState<K>(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const directionMultiplier = sortDirection === 'asc' ? 1 : -1;
  const sortedItems = [...items].sort((left, right) => directionMultiplier * comparators[sortKey](left, right));

  const updateSort = (nextSortKey: K) => {
    if (nextSortKey === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection('asc');
  };

  const sortableHeader = (key: K, label: string, align?: ManagementTableHeader['align']): ManagementTableHeader => ({
    label,
    align,
    sortDirection: sortKey === key ? sortDirection : undefined,
    onSort: () => updateSort(key),
  });

  return { sortedItems, sortableHeader };
};

export default useTableSort;
