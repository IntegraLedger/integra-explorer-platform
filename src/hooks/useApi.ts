import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type { ApiError } from '@/types/api.types';

export function useApi<T>(
  key: string | string[],
  url: string,
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>,
) {
  const queryKey = Array.isArray(key) ? key : [key];

  return useQuery<T, ApiError>({
    queryKey: [...queryKey, params],
    queryFn: () => apiService.get<T>(url, params),
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
}