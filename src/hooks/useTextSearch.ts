import { useState } from 'react';

type UseTextSearchResult<T> = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredItems: T[];
};

/**
 * Owns a search-term string and filters `items` to those where any of
 * `matchFn(item)`'s strings contains the term (case-insensitive substring,
 * no typo tolerance). An empty/whitespace-only term returns `items` unchanged.
 */
const useTextSearch = <T>(items: T[], matchFn: (item: T) => string[]): UseTextSearchResult<T> => {
  const [searchTerm, setSearchTerm] = useState('');

  const trimmedTerm = searchTerm.trim().toLowerCase();
  const filteredItems = trimmedTerm
    ? items.filter((item) => matchFn(item).some((value) => value.toLowerCase().includes(trimmedTerm)))
    : items;

  return { searchTerm, setSearchTerm, filteredItems };
};

export default useTextSearch;
