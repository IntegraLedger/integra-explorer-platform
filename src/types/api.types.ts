export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ChainInfo {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockTime: number;
  isActive: boolean;
  lastIndexedBlock: number;
  createdAt: string;
  updatedAt: string;
}

import type { TransactionSummaryDto } from './transaction.types';

export interface SearchResult {
  type: 'transaction' | 'block' | 'document' | 'not_found';
  result: UniversalSearchResult | BlockSearchResult | null;
}

export interface UniversalSearchResult {
  query: string;
  totalMatches: number;
  transactions: TransactionSummaryDto[];
}

export interface BlockSearchResult {
  blockNumber: number;
  transactionCount: number;
  chainId: number;
}

export interface ChainStats {
  chainId: number;
  totalTransactions: number;
  totalBlocks: number;
  lastBlock: number;
  lastBlockTime: string;
}

export interface ApiError {
  message: string;
  error?: string;
  statusCode: number;
}