export const validators = {
  // Validate Ethereum address
  isValidAddress: (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/i.test(address);
  },

  // Validate transaction hash
  isValidTxHash: (hash: string): boolean => {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  },

  // Validate block number
  isValidBlockNumber: (blockNumber: string): boolean => {
    return /^\d+$/.test(blockNumber) && Number(blockNumber) >= 0;
  },

  // Validate chain ID
  isValidChainId: (chainId: number): boolean => {
    return Number.isInteger(chainId) && chainId > 0;
  },

  // Validate hex string
  isHexString: (value: string): boolean => {
    return /^0x[a-fA-F0-9]*$/.test(value);
  },

  // Validate Integra ID format
  isValidIntegraId: (id: string): boolean => {
    // Allow alphanumeric with optional hyphens/underscores
    return /^[a-zA-Z0-9_-]+$/.test(id);
  },

  // Validate file type for document upload
  isValidFileType: (_file: File): boolean => {
    // Accept all file types for now
    return true;
  },

  // Validate file size (max 50MB)
  isValidFileSize: (file: File): boolean => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    return file.size <= maxSize;
  },

  // Validate search query
  isValidSearchQuery: (query: string): boolean => {
    return query.trim().length >= 1;
  },

  // Sanitize search query
  sanitizeSearchQuery: (query: string): string => {
    return query.trim().toLowerCase();
  },
};