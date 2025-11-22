import axios, { AxiosInstance, AxiosError } from 'axios';
import { HTTP_CONFIG, API_URLS, LOG_MESSAGES } from '@/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_URLS.DEFAULT_PRODUCTION;

/**
 * Creates and configures an Axios instance for API requests
 */
export const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: HTTP_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': HTTP_CONFIG.CONTENT_TYPE,
  },
});

// Request interceptor for adding auth token
httpClient.interceptors.request.use(
  (config) => {
    // Get Telegram init data from window if available
    const initData = (window as any).Telegram?.WebApp?.initData;
    if (initData) {
      config.headers[HTTP_CONFIG.TELEGRAM_INIT_DATA_HEADER_ALT] = initData;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      console.error(LOG_MESSAGES.API_ERROR, {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error(LOG_MESSAGES.NETWORK_ERROR, error.message);
    } else {
      // Something else happened
      console.error(LOG_MESSAGES.ERROR, error.message);
    }
    return Promise.reject(error);
  }
);

export default httpClient;

