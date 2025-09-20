export interface Transaction {
  tx_hash: string;
  block_number: number;
  block_timestamp: string;
  from_address: string;
  to_address: string;
  value: string;
  gas_used: number;
  gas_price: string;
  status: 'success' | 'failed';
  chain: string;
  integra_hash?: string;
}

export interface Block {
  block_number: number;
  block_hash: string;
  block_timestamp: string;
  parent_hash: string;
  tx_count: number;
  gas_used: number;
  gas_limit: number;
  base_fee?: string;
  chain: string;
  transactions?: Transaction[];
}

export interface Pool {
  pool_id: string;
  pool_name: string;
  contract_address: string;
  chain: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  tvl?: string;
  recentTransactions?: Transaction[];
}

export interface AnalyticsOverview {
  totalTransactions: number;
  totalBlocks: number;
  uniqueAddresses: number;
  activePools: number;
  timestamp: string;
}

export interface ChartData {
  labels: string[];
  data: number[];
  metric: 'transactions' | 'blocks' | 'gas';
  period: '24h' | '7d' | '30d';
}

export interface SearchResult {
  type: 'transaction' | 'address' | 'block' | 'unknown';
  redirect?: string;
  results?: any[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface Env {
  DB_BLOCKCHAIN: D1Database;
  DB_POOL: D1Database;
  CACHE: KVNamespace;
  ENVIRONMENT: string;
}