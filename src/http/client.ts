import axios, { AxiosInstance, AxiosError } from 'axios';
import { HTTP_CONFIG, API_URLS, LOG_MESSAGES, TEMP_INIT_DATA } from '@/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_URLS.DEFAULT_PRODUCTION;

/**
 * Creates and returns a configured Axios instance with interceptors
 */
export function getHttpClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: HTTP_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': HTTP_CONFIG.CONTENT_TYPE,
    },
  });

  // Request interceptor for adding Telegram init data
  instance.interceptors.request.use(
    (config) => {
      // Get Telegram init data from window if available
      let initData = (window as any).Telegram?.WebApp?.initData;
      
      // Use temporary initData in development mode if real initData is not available
      if (!initData && !import.meta.env.PROD) {
        initData = TEMP_INIT_DATA;
      }
      
      if (initData) {
        config.headers[HTTP_CONFIG.TELEGRAM_INIT_DATA_HEADER] = initData;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
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

  return instance;
}
