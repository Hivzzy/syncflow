import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * Custom Error Class for API responses
 */
export class ApiError extends Error {
  statusCode: number;
  data: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * Centralized Axios Instance configured for SyncFlow API
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Response Interceptor for uniform error parsing
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: unknown }>) => {
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'An unexpected API error occurred';
    const data = error.response?.data?.errors || null;

    return Promise.reject(new ApiError(message, statusCode, data));
  }
);

/**
 * Type-Safe API Client Helper Methods
 */
export const api = {
  /**
   * HTTP GET Request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  },

  /**
   * HTTP POST Request
   */
  async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.post<T>(url, data, config);
    return response.data;
  },

  /**
   * HTTP PATCH Request
   */
  async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.patch<T>(url, data, config);
    return response.data;
  },

  /**
   * HTTP PUT Request
   */
  async put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.put<T>(url, data, config);
    return response.data;
  },

  /**
   * HTTP DELETE Request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  },
};

export default api;
