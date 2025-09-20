export const formatters = {
  // Format hash with ellipsis
  truncateHash: (hash: string, startLength = 6, endLength = 4): string => {
    if (!hash || hash.length <= startLength + endLength) {return hash;}
    return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
  },

  // Format address
  truncateAddress: (address: string): string => {
    if (!address) {return '';}
    return formatters.truncateHash(address, 6, 4);
  },

  // Format timestamp to readable date
  formatDate: (timestamp: string | number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  },

  // Format timestamp to readable date and time without seconds
  formatDateTime: (timestamp: string | number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Format relative time
  formatRelativeTime: (timestamp: string | number): string => {
    const now = Date.now();
    const time = new Date(timestamp).getTime();
    const diff = now - time;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {return `${days} day${days > 1 ? 's' : ''} ago`;}
    if (hours > 0) {return `${hours} hour${hours > 1 ? 's' : ''} ago`;}
    if (minutes > 0) {return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;}
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  },

  // Format wei to ether
  formatEther: (wei: string): string => {
    if (!wei) {return '0';}
    const value = BigInt(wei);
    const ether = Number(value) / 1e18;
    return ether.toFixed(6).replace(/\.?0+$/, '');
  },

  // Format gas price to gwei
  formatGwei: (wei: string): string => {
    if (!wei) {return '0';}
    const value = BigInt(wei);
    const gwei = Number(value) / 1e9;
    return gwei.toFixed(2);
  },

  // Format number with commas
  formatNumber: (num: string | number): string => {
    return Number(num).toLocaleString('en-US');
  },

  // Format transaction fee
  formatTxFee: (gasUsed: string, gasPrice: string): string => {
    const fee = BigInt(gasUsed) * BigInt(gasPrice);
    return formatters.formatEther(fee.toString());
  },

  // Get chain name
  getChainName: (chainId: number): string => {
    const chains: Record<number, string> = {
      1: 'Ethereum',
      137: 'Polygon',
      8453: 'Base',
      43114: 'Avalanche',
      42161: 'Arbitrum',
      10: 'Optimism',
      56: 'BNB',
      42220: 'Celo',
      25: 'Cronos',
      1329: 'Sei',
      146: 'Sonic',
    };
    return chains[chainId] || `Chain ${chainId}`;
  },

  // Get status color
  getStatusColor: (status: 'success' | 'failed'): string => {
    return status === 'success' ? 'green' : 'red';
  },

  // Format percentage
  formatPercentage: (value: number, decimals = 2): string => {
    return `${value.toFixed(decimals)}%`;
  },
};