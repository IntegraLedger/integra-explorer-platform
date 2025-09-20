export interface DecodedInput {
  method: string;
  params: Record<string, unknown>;
  signature?: string;
  methodId?: string;
}

export interface DecodedEventData {
  eventName: string;
  signature: string;
  params: Record<string, unknown>;
}

export interface TransactionSummaryDto {
  hash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  status: 'success' | 'failed';
  method: string;
  contractType: string;
  chainId: number;
  eventCount: number;
  // Document-centric fields
  integraHash?: string;
  documentHash?: string;
  processHash?: string;
  primaryData?: Record<string, unknown>;
}

export interface TransactionDetailDto extends TransactionSummaryDto {
  input: string;
  decodedInput?: DecodedInput;
  logs: EventLog[];
  blockHash: string;
  transactionIndex: number;
  nonce: number;
  cumulativeGasUsed: string;
  effectiveGasPrice: string;
  type: number;
  rawTransaction: {
    to: string;
    from: string;
    nonce: number;
    value: string;
    gasLimit: string;
    gasPrice: string;
    blockHash: string;
    blockNumber: number;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
    transactionIndex: number;
  };
}

export interface EventLog {
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  address: string;
  data: string;
  topics: string[];
  eventName?: string;
  decodedData?: DecodedEventData;
}

export interface BlockTransactionsDto {
  blockNumber: number;
  chainId: number;
  timestamp: string | null;
  transactionCount: number;
  transactions: TransactionSummaryDto[];
}