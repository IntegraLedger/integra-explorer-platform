import { apiService } from './api.service';
import { logger } from './logger.service';
import { SearchType } from '@/types/search.types';
import type { SearchResult } from '@/types/api.types';
import type { SearchHistory } from '@/types/search.types';

export class SearchService {
  // Detect the type of search query
  static detectSearchType(query: string): SearchType {
    // Remove whitespace
    const cleanQuery = query.trim();

    // 0x + 64 chars = universal hash (transaction/document/integra/process)
    if (/^0x[a-fA-F0-9]{64}$/.test(cleanQuery)) {
      return SearchType.TRANSACTION_HASH; // Will use universal search
    }

    // Numeric = block number
    if (/^\d+$/.test(cleanQuery)) {
      return SearchType.BLOCK_NUMBER;
    }

    // Default to Integra ID (will be converted to hash)
    return SearchType.INTEGRA_ID;
  }

  // Universal search using integra-api v1.0 search endpoint
  static async universalSearch(query: string, chainId?: number): Promise<SearchResult[]> {
    try {
      // For now, create a simple fetch call
      const response = await fetch(`/api/search?input=${encodeURIComponent(JSON.stringify({ q: query }))}`);
      const data: any = await response.json();
      const searchResult = data.result?.data || data.result || data;
      return [searchResult];
    } catch (error) {
      // If search fails, try to determine if it's an Integra ID that needs conversion
      const searchType = this.detectSearchType(query);
      if (searchType === SearchType.INTEGRA_ID) {
        try {
          // Convert Integra ID to hash and search again
          const { keccak256 } = await import('ethers');
          const cleanId = query.replace(/[^a-zA-Z0-9]/g, '');
          const hash = keccak256(Buffer.from(cleanId));

          // Search with the converted hash
          const searchResult = await apiService.get<SearchResult>('/v1/search', { q: hash });
          return [searchResult];
        } catch (hashError) {
          logger.error('Hash search error', hashError instanceof Error ? hashError : new Error(String(hashError)), { query, chainId });
        }
      }

      logger.error('Search error', error instanceof Error ? error : new Error(String(error)), { query, chainId });
      // Return empty results on error
      return [{
        type: 'not_found',
        result: null,
      }];
    }
  }

  // Store search in local storage
  static saveSearchHistory(query: string, type: SearchType, result?: SearchResult): void {
    const history = this.getSearchHistory();
    const newEntry: SearchHistory = {
      query,
      timestamp: Date.now(),
      type,
      result,
    };

    // Add to beginning and limit to 20 entries
    history.unshift(newEntry);
    if (history.length > 20) {
      history.pop();
    }

    localStorage.setItem('searchHistory', JSON.stringify(history));
  }

  // Get search history from local storage
  static getSearchHistory(): SearchHistory[] {
    try {
      const history = localStorage.getItem('searchHistory');
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  // Clear search history
  static clearSearchHistory(): void {
    localStorage.removeItem('searchHistory');
  }
}