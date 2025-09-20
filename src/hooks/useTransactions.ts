import { trpc } from '@/utils/trpc';

export function useTransactions(page = 1, limit = 20, chainId?: number) {
  return trpc.transactions.useQuery({ page, limit, chainId });
}

export function useTransactionDetail(hash: string) {
  return trpc.transactionDetail.useQuery(
    { hash },
    { enabled: !!hash }
  );
}

export function useBlockTransactions(blockNumber: string | number) {
  const blockNum = typeof blockNumber === 'string' ? parseInt(blockNumber) : blockNumber;

  return trpc.blockTransactions.useQuery(
    { blockNumber: blockNum, chainId: 137 },
    { enabled: !isNaN(blockNum) }
  );
}