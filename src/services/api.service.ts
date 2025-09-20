import axios, { type AxiosInstance, AxiosError } from 'axios';
import { logger, frontendLogger } from './logger.service';
import { createAxiosInterceptor } from '@integraledger/frontend-logger';
import type { ApiError } from '@/types/api.types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    // In production, use the public HTTPS endpoint for blockchain API
    // In development, use proxy to avoid CORS issues
    const baseURL = import.meta.env.PROD
      ? 'https://tx.trustwithintegra.com/v1'
      : '/v1';

    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Debug logging
    logger.info('API Service initialized', { baseURL: this.client.defaults.baseURL });

    // Add the frontend logger interceptor for automatic API logging
    createAxiosInterceptor(this.client, frontendLogger);

    // Additional custom interceptor for API error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response) {
          // Server responded with error status
          const apiError: ApiError = {
            message: error.response.data?.message || 'An error occurred',
            error: error.response.data?.error,
            statusCode: error.response.status,
          };
          return Promise.reject(apiError);
        } else if (error.request) {
          // Request was made but no response
          const apiError: ApiError = {
            message: 'Network error - please check your connection',
            statusCode: 0,
          };
          return Promise.reject(apiError);
        } else {
          // Something else happened
          const apiError: ApiError = {
            message: error.message || 'An unexpected error occurred',
            statusCode: 0,
          };
          return Promise.reject(apiError);
        }
      },
    );
  }

  get axios(): AxiosInstance {
    return this.client;
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: Record<string, unknown>): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: Record<string, unknown>): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

export const apiService = new ApiService();