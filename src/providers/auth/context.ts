import { createContext } from 'react';
import type { IAuthContext } from './types';
import initialState from './state';

/**
 * Auth context with default values
 * Exported for useAuth hook
 */
export const AuthContext = createContext<IAuthContext>({
  state: initialState(),
  setLoading: () => {},
  setUser: () => {},
  setError: () => {},
  clearError: () => {},
  logout: () => {},
  getUserInfo: async () => {},
  createUser: async () => {
    throw new Error('AuthProvider not initialized');
  },
});

