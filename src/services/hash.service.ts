import { keccak256 } from 'ethers';
import type { FileMetadata } from '@/types/search.types';

export class HashService {
  // Calculate keccak256 hash of a file
  static async calculateFileHash(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const bytes = new Uint8Array(arrayBuffer);
          const hash = keccak256(bytes);
          resolve(hash); // keccak256 already returns 0x-prefixed string
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  // Calculate hash of a string (for Integra ID)
  static calculateStringHash(input: string): string {
    // Remove any non-alphanumeric characters
    const cleanInput = input.replace(/[^a-zA-Z0-9]/g, '');
    // Convert to bytes and hash
    return keccak256(Buffer.from(cleanInput));
  }

  // Get file metadata
  static getFileMetadata(file: File): FileMetadata {
    return {
      name: file.name,
      size: file.size,
      type: file.type || 'unknown',
      lastModified: file.lastModified,
    };
  }

  // Format file size for display
  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) {return '0 Bytes';}
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100  } ${  sizes[i]}`;
  }

  // Validate if string is a valid hash
  static isValidHash(hash: string): boolean {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  }

  // Validate if string is a valid Ethereum address
  static isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/i.test(address);
  }
}