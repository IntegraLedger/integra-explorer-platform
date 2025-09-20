import { keccak256 } from 'ethers';

export const converters = {
  // Convert Integra ID to hash
  integraIdToHash: (integraId: string): string => {
    // Remove any non-alphanumeric characters
    const cleanId = integraId.replace(/[^a-zA-Z0-9]/g, '');
    // Convert to bytes and hash
    return keccak256(Buffer.from(cleanId));
  },

  // Convert hex string to number
  hexToNumber: (hex: string): number => {
    return parseInt(hex, 16);
  },

  // Convert number to hex
  numberToHex: (num: number): string => {
    return `0x${  num.toString(16)}`;
  },

  // Convert wei to ether
  weiToEther: (wei: string | bigint): string => {
    const value = typeof wei === 'string' ? BigInt(wei) : wei;
    return (Number(value) / 1e18).toString();
  },

  // Convert ether to wei
  etherToWei: (ether: string): bigint => {
    const value = parseFloat(ether);
    return BigInt(Math.floor(value * 1e18));
  },

  // Convert gwei to wei
  gweiToWei: (gwei: string): bigint => {
    const value = parseFloat(gwei);
    return BigInt(Math.floor(value * 1e9));
  },

  // Convert timestamp to ISO string
  timestampToISO: (timestamp: number | string): string => {
    const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
    // Check if timestamp is in seconds (blockchain) or milliseconds
    const date = ts < 10000000000 ? new Date(ts * 1000) : new Date(ts);
    return date.toISOString();
  },

  // Convert block timestamp to date
  blockTimestampToDate: (timestamp: string | number): Date => {
    const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
    // Blockchain timestamps are usually in seconds
    return new Date(ts * 1000);
  },

  // Convert file to base64
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  },

  // Convert array buffer to hex
  arrayBufferToHex: (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    return `0x${  Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')}`;
  },
};