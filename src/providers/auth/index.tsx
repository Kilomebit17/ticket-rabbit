import {
  ComponentType,
  createContext,
  PropsWithChildren,
  useContext,
} from 'react';
import type { IAuthContext } from './types';
import initialState from './state';
import { useAuthService } from './service';

/**
 * Auth context with default values
 */
export const AuthContext = createContext<IAuthContext>({
  state: initialState(),
  setLoading: () => {},
  setUser: () => {},
  setError: () => {},
  clearError: () => {},
  logout: () => {},
  checkUser: async () => {},
  createUser: async () => {
    throw new Error('AuthProvider not initialized');
  },
});

/**
 * AuthProvider component
 * Provides authentication context to the application
 */
export const AuthProvider: ComponentType<PropsWithChildren> = ({
  children,
}) => {
  const service = useAuthService();
  return (
    <AuthContext.Provider value={service}>{children}</AuthContext.Provider>
  );
};

/**
 * Hook to use auth context
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): IAuthContext => {
  return useContext(AuthContext);
};

