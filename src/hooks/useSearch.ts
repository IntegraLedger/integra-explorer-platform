import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SearchService } from '@/services/search.service';
import type { SearchResult } from '@/types/api.types';

export function useSearch() {
  const [searchHistory, setSearchHistory] = useState(() =>
    SearchService.getSearchHistory(),
  );

  const searchMutation = useMutation<SearchResult[], Error, { query: string; chainId?: number }>({
    mutationFn: async ({ query, chainId }) => {
      const results = await SearchService.universalSearch(query, chainId);

      if (results.length > 0) {
        const searchType = SearchService.detectSearchType(query);
        SearchService.saveSearchHistory(query, searchType, results[0]);
        setSearchHistory(SearchService.getSearchHistory());
      }

      return results;
    },
  });

  const clearHistory = useCallback(() => {
    SearchService.clearSearchHistory();
    setSearchHistory([]);
  }, []);

  return {
    search: searchMutation.mutate,
    searchAsync: searchMutation.mutateAsync,
    isSearching: searchMutation.isPending,
    searchResults: searchMutation.data,
    searchError: searchMutation.error,
    searchHistory,
    clearHistory,
  };
}