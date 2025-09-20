export interface ChainConfig {
  id: number;
  name: string;
  icon: string;
  explorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export const CHAIN_CONFIGS: Record<number, ChainConfig> = {
  1: {
    id: 1,
    name: 'Ethereum',
    icon: '/assets/chain-icons/ethereum-eth-icon.svg',
    explorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  137: {
    id: 137,
    name: 'Polygon',
    icon: '/assets/chain-icons/polygon-matic-icon.svg',
    explorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  8453: {
    id: 8453,
    name: 'Base',
    icon: '/assets/chain-icons/base-icon.png',
    explorer: 'https://basescan.org',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  43114: {
    id: 43114,
    name: 'Avalanche',
    icon: '/assets/chain-icons/avalanche-avax-icon.svg',
    explorer: 'https://snowtrace.io',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
  },
  42161: {
    id: 42161,
    name: 'Arbitrum',
    icon: '/assets/chain-icons/arbitrum-arb-icon.svg',
    explorer: 'https://arbiscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  10: {
    id: 10,
    name: 'Optimism',
    icon: '/assets/chain-icons/optimism-op-icon.svg',
    explorer: 'https://optimistic.etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  56: {
    id: 56,
    name: 'BNB',
    icon: '/assets/chain-icons/bnb-bnb-icon.svg',
    explorer: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
  },
  42220: {
    id: 42220,
    name: 'Celo',
    icon: '/assets/chain-icons/celo-celo-icon.svg',
    explorer: 'https://celoscan.io',
    nativeCurrency: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18,
    },
  },
  25: {
    id: 25,
    name: 'Cronos',
    icon: '/assets/chain-icons/cronos-cro-icon.svg',
    explorer: 'https://cronoscan.com',
    nativeCurrency: {
      name: 'CRO',
      symbol: 'CRO',
      decimals: 18,
    },
  },
  1329: {
    id: 1329,
    name: 'Sei',
    icon: '/assets/chain-icons/sei-sei-icon.svg',
    explorer: 'https://seitrace.com',
    nativeCurrency: {
      name: 'SEI',
      symbol: 'SEI',
      decimals: 18,
    },
  },
  146: {
    id: 146,
    name: 'Sonic',
    icon: '/assets/chain-icons/sonic-icon.webp',
    explorer: 'https://sonicscan.org',
    nativeCurrency: {
      name: 'S',
      symbol: 'S',
      decimals: 18,
    },
  },
};

export function getChainConfig(chainId: number): ChainConfig | undefined {
  return CHAIN_CONFIGS[chainId];
}

export function getChainName(chainId: number): string {
  return CHAIN_CONFIGS[chainId]?.name || `Chain ${chainId}`;
}

export function getChainIcon(chainId: number): string {
  return CHAIN_CONFIGS[chainId]?.icon || '';
}

export function getChainExplorerUrl(chainId: number, txHash: string): string {
  const config = CHAIN_CONFIGS[chainId];
  if (!config) {
    return '';
  }
  return `${config.explorer}/tx/${txHash}`;
}

export function getAllChains(): ChainConfig[] {
  return Object.values(CHAIN_CONFIGS);
}