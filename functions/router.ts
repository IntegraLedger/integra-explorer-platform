import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { Env } from '@shared/types';

export interface Context {
  env: Env;
}

const t = initTRPC.context<Context>().create();

// Types matching the actual blockchain API
interface TransactionRow {
  id: string;
  chain_id: number;
  contract_type: string;
  contract_address: string;
  block_number: number;
  block_timestamp: string;
  transaction_hash: string;
  transaction_data: string; // JSON string
  receipt_data: string; // JSON string
  raw_input: string;
  indexed_at: string;
  event_published?: string;
  parsed_input?: string; // JSON string
  parsed_events?: string; // JSON string
  document_data?: string; // JSON string
}

interface TransactionSummary {
  hash: string;
  blockNumber: number;
  timestamp: Date;
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
  integraHash?: string;
  documentHash?: string;
  processHash?: string;
}

// Helper to transform database row to API response
function transformTransaction(row: TransactionRow): TransactionSummary | null {
  try {
    const txData = JSON.parse(row.transaction_data);
    const receiptData = JSON.parse(row.receipt_data);
    const docData = row.document_data ? JSON.parse(row.document_data) : null;

    return {
      hash: row.transaction_hash,
      blockNumber: row.block_number,
      timestamp: new Date(row.block_timestamp),
      from: txData.from || '',
      to: txData.to || row.contract_address || '',
      value: txData.value || '0',
      gasUsed: receiptData.gasUsed || '0',
      gasPrice: txData.gasPrice || '0',
      status: receiptData.status === 1 ? 'success' : 'failed',
      method: docData?.method || 'Unknown',
      contractType: row.contract_type || 'Unknown',
      chainId: row.chain_id,
      eventCount: receiptData.logs?.length || 0,
      integraHash: docData?.integraHash,
      documentHash: docData?.documentHash,
      processHash: docData?.processHash,
    };
  } catch (error) {
    console.error('Error transforming transaction:', error);
    return null;
  }
}

export const appRouter = t.router({
  // Health check
  health: t.procedure.query(() => ({
    status: 'healthy',
    timestamp: new Date().toISOString()
  })),

  // Match the actual blockchain API endpoints
  transactions: t.procedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      chainId: z.number().optional(),
      contractType: z.string().optional(),
      contractAddress: z.string().optional(),
      integraHash: z.string().optional(),
      documentHash: z.string().optional(),
      processHash: z.string().optional(),
      method: z.string().optional(),
      blockNumber: z.number().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const { page = 1, limit = 20, ...filters } = input;
      const offset = (page - 1) * limit;

      // Build query conditions
      const conditions: string[] = [];
      const bindings: any[] = [];

      if (filters.chainId !== undefined) {
        conditions.push('chain_id = ?');
        bindings.push(filters.chainId);
      }

      if (filters.contractType) {
        conditions.push('contract_type = ?');
        bindings.push(filters.contractType);
      }

      if (filters.contractAddress) {
        conditions.push('LOWER(contract_address) = LOWER(?)');
        bindings.push(filters.contractAddress);
      }

      if (filters.blockNumber !== undefined) {
        conditions.push('block_number = ?');
        bindings.push(filters.blockNumber);
      }

      if (filters.integraHash) {
        conditions.push(`json_extract(document_data, '$.integraHash') = ?`);
        bindings.push(filters.integraHash);
      }

      if (filters.documentHash) {
        conditions.push(`json_extract(document_data, '$.documentHash') = ?`);
        bindings.push(filters.documentHash);
      }

      if (filters.method) {
        conditions.push(`json_extract(document_data, '$.method') = ?`);
        bindings.push(filters.method);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM transactions ${whereClause}`;
      let countResult: { total: number } | null;
      if (bindings.length > 0) {
        countResult = await ctx.env.DB_BLOCKCHAIN.prepare(countQuery).bind(...bindings).first<{ total: number }>();
      } else {
        countResult = await ctx.env.DB_BLOCKCHAIN.prepare(countQuery).first<{ total: number }>();
      }
      const total = countResult?.total || 0;

      // Get paginated results
      const query = `
        SELECT * FROM transactions
        ${whereClause}
        ORDER BY block_timestamp DESC, transaction_hash DESC
        LIMIT ? OFFSET ?
      `;

      // Always include limit and offset in bindings
      const allBindings = [...bindings, limit, offset];
      const result = await ctx.env.DB_BLOCKCHAIN.prepare(query).bind(...allBindings).all<TransactionRow>();

      const items = (result.results || [])
        .map(transformTransaction)
        .filter((tx): tx is TransactionSummary => tx !== null);

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  transactionDetail: t.procedure
    .input(z.object({ hash: z.string() }))
    .query(async ({ input, ctx }) => {
      const result = await ctx.env.DB_BLOCKCHAIN.prepare(`
        SELECT * FROM transactions
        WHERE LOWER(transaction_hash) = LOWER(?)
        LIMIT 1
      `).bind(input.hash).first<TransactionRow>();

      if (!result) {
        throw new Error('Transaction not found');
      }

      const summary = transformTransaction(result);
      if (!summary) {
        throw new Error('Failed to parse transaction');
      }

      // Parse additional details
      const parsedInput = result.parsed_input ? JSON.parse(result.parsed_input) : null;
      const parsedEvents = result.parsed_events ? JSON.parse(result.parsed_events) : null;
      const txData = JSON.parse(result.transaction_data);
      const receiptData = JSON.parse(result.receipt_data);

      return {
        ...summary,
        decodedInput: parsedInput,
        events: parsedEvents,
        rawData: {
          transaction: txData,
          receipt: receiptData,
        },
      };
    }),

  blockTransactions: t.procedure
    .input(z.object({
      blockNumber: z.number(),
      chainId: z.number().default(137),
    }))
    .query(async ({ input, ctx }) => {
      const result = await ctx.env.DB_BLOCKCHAIN.prepare(`
        SELECT * FROM transactions
        WHERE chain_id = ? AND block_number = ?
        ORDER BY transaction_hash
      `).bind(input.chainId, input.blockNumber).all<TransactionRow>();

      const transactions = (result.results || [])
        .map(transformTransaction)
        .filter((tx): tx is TransactionSummary => tx !== null);

      return {
        blockNumber: input.blockNumber,
        chainId: input.chainId,
        timestamp: transactions[0]?.timestamp || null,
        transactionCount: transactions.length,
        transactions,
      };
    }),

  search: t.procedure
    .input(z.object({ q: z.string() }))
    .query(async ({ input, ctx }) => {
      const query = input.q.trim();

      // Search by transaction hash, integra hash, or document hash
      let transactions: TransactionRow[] = [];

      // Try transaction hash first (case insensitive)
      if (/^0x[a-f0-9]{64}$/i.test(query)) {
        const byTxHash = await ctx.env.DB_BLOCKCHAIN.prepare(`
          SELECT * FROM transactions
          WHERE LOWER(transaction_hash) = LOWER(?)
          LIMIT 10
        `).bind(query).all<TransactionRow>();

        if (byTxHash.results && byTxHash.results.length > 0) {
          transactions = byTxHash.results;
        }
      }

      // If no results, try integra hash
      if (transactions.length === 0) {
        const byIntegraHash = await ctx.env.DB_BLOCKCHAIN.prepare(`
          SELECT * FROM transactions
          WHERE json_extract(document_data, '$.integraHash') = ?
          LIMIT 10
        `).bind(query).all<TransactionRow>();

        if (byIntegraHash.results && byIntegraHash.results.length > 0) {
          transactions = byIntegraHash.results;
        }
      }

      // If no results, try document hash
      if (transactions.length === 0) {
        const byDocHash = await ctx.env.DB_BLOCKCHAIN.prepare(`
          SELECT * FROM transactions
          WHERE json_extract(document_data, '$.documentHash') = ?
          LIMIT 10
        `).bind(query).all<TransactionRow>();

        if (byDocHash.results && byDocHash.results.length > 0) {
          transactions = byDocHash.results;
        }
      }

      // If we found transactions, return them in the expected format
      if (transactions.length > 0) {
        const items = transactions
          .map(transformTransaction)
          .filter((tx): tx is TransactionSummary => tx !== null);

        return {
          type: 'transaction' as const,
          result: {
            query,
            totalMatches: items.length,
            transactions: items,
          },
        };
      }

      // Check if it's a block number
      if (/^\d+$/.test(query)) {
        const blockNum = parseInt(query, 10);
        const block = await ctx.env.DB_BLOCKCHAIN.prepare(`
          SELECT COUNT(*) as count, chain_id FROM transactions
          WHERE block_number = ?
          GROUP BY chain_id
          LIMIT 1
        `).bind(blockNum).first<{ count: number; chain_id: number }>();

        if (block && block.count > 0) {
          return {
            type: 'block' as const,
            result: {
              blockNumber: blockNum,
              transactionCount: block.count,
              chainId: block.chain_id,
            },
          };
        }
      }

      // No results found
      return {
        type: 'not_found' as const,
        result: null,
      };
    }),

  stats: t.procedure
    .input(z.object({
      chainId: z.number().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const chainCondition = input.chainId ? 'WHERE chain_id = ?' : '';
      const bindings = input.chainId ? [input.chainId] : [];

      const [txCount, chainCount, latestBlock] = await Promise.all([
        ctx.env.DB_BLOCKCHAIN.prepare(
          `SELECT COUNT(*) as count FROM transactions ${chainCondition}`
        ).bind(...bindings).first<{ count: number }>(),

        ctx.env.DB_BLOCKCHAIN.prepare(
          `SELECT COUNT(DISTINCT chain_id) as count FROM transactions`
        ).first<{ count: number }>(),

        ctx.env.DB_BLOCKCHAIN.prepare(
          `SELECT MAX(block_number) as latest FROM transactions ${chainCondition}`
        ).bind(...bindings).first<{ latest: number }>(),
      ]);

      return {
        totalTransactions: txCount?.count || 0,
        totalChains: chainCount?.count || 0,
        latestBlock: latestBlock?.latest || 0,
        timestamp: new Date().toISOString(),
      };
    }),
});

export type AppRouter = typeof appRouter;