import {
  ComponentType,
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import type { AxiosInstance } from 'axios';
import { getHttpClient } from '@/http/client';

/**
 * HttpClient context with default value
 */
const HttpClientContext = createContext<AxiosInstance>(getHttpClient());

/**
 * HttpClientProvider component
 * Provides HTTP client instance to the application
 */
export const HttpClientProvider: ComponentType<PropsWithChildren> = ({
  children,
}) => {
  const httpClient = useMemo(() => getHttpClient(), []);

  return (
    <HttpClientContext.Provider value={httpClient}>
      {children}
    </HttpClientContext.Provider>
  );
};

/**
 * Hook to use HTTP client from context
 */
export const useHttpClient = (): AxiosInstance => {
  return useContext(HttpClientContext);
};
