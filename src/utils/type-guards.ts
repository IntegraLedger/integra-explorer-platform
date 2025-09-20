import type { TransactionSummaryDto, BlockTransactionsDto } from '@/types/transaction.types';

// Type guards for search result data
export function isTransactionData(data: unknown): data is TransactionSummaryDto {
  return typeof data === 'object' && data !== null && 'transactionHash' in data;
}

export function isBlockData(data: unknown): data is BlockTransactionsDto {
  return typeof data === 'object' && data !== null && 'blockNumber' in data && 'transactions' in data;
}

export function isHashData(data: unknown): data is { hash?: string; integraHash?: string; docHash?: string; integraId?: string } {
  return typeof data === 'object' && data !== null &&
    ('hash' in data || 'integraHash' in data || 'docHash' in data);
}