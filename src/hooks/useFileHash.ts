import { useState, useCallback } from 'react';
import { HashService } from '@/services/hash.service';
import type { FileMetadata } from '@/types/search.types';

export function useFileHash() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateHash = useCallback(async (file: File) => {
    setIsCalculating(true);
    setError(null);

    try {
      // Get file metadata
      const metadata = HashService.getFileMetadata(file);
      setFileMetadata(metadata);

      // Calculate hash
      const fileHash = await HashService.calculateFileHash(file);
      setHash(fileHash);

      return fileHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate hash';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setFileMetadata(null);
    setHash(null);
    setError(null);
    setIsCalculating(false);
  }, []);

  return {
    calculateHash,
    isCalculating,
    fileMetadata,
    hash,
    error,
    reset,
  };
}