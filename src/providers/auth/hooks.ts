import type { User } from '@/types';
import { useAuth } from './useAuth';

/**
 * Hook to get the current authenticated user
 * @returns The current user or null if not authenticated
 */
export const useCurrentUser = (): User | null => {
  const { state } = useAuth();
  return state.user;
};

/**
 * Hook to get the authentication loading state
 * @returns True if authentication is in progress, false otherwise
 */
export const useAuthLoading = (): boolean => {
  const { state } = useAuth();
  return state.isLoading;
};

/**
 * Hook to get the authentication error state
 * @returns The error message or null if no error
 */
export const useAuthError = (): string | null => {
  const { state } = useAuth();
  return state.error;
};

/**
 * Hook to get the current user's balance
 * @returns The user's balance or 0 if not authenticated
 */
export const useAuthBalance = (): number => {
  const { state } = useAuth();
  return state.user?.balance || 0;
};

/**
 * Hook to check if user is authenticated
 * @returns True if user is authenticated, false otherwise
 */
export const useIsAuthenticated = (): boolean => {
  const { state } = useAuth();
  return state.user !== null;
};

