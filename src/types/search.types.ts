export const SearchType = {
  TRANSACTION_HASH: 'tx_hash',
  ETHEREUM_ADDRESS: 'address',
  INTEGRA_HASH: 'integra_hash',
  DOCUMENT_HASH: 'document_hash',
  INTEGRA_ID: 'integra_id',
  BLOCK_NUMBER: 'block_number',
} as const;

export type SearchType = typeof SearchType[keyof typeof SearchType];

export interface SearchQuery {
  query: string;
  type?: SearchType;
  chainId?: number;
}

import type { SearchResult } from './api.types';

export interface SearchHistory {
  query: string;
  timestamp: number;
  type: SearchType;
  result?: SearchResult;
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  hash?: string;
}