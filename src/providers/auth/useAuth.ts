import { useContext } from 'react';
import type { IAuthContext } from './types';
import { AuthContext } from './context';

/**
 * Hook to use auth context
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): IAuthContext => {
  return useContext(AuthContext);
};

