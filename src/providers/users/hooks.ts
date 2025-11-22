import type { User } from '@/types';
import { useUsers } from './useUsers';

/**
 * Hook to get the search results
 * @returns Array of found users
 */
export const useSearchResults = (): User[] => {
  const { state } = useUsers();
  return state.searchResults;
};

/**
 * Hook to get the users loading state
 * @returns True if search is in progress, false otherwise
 */
export const useUsersLoading = (): boolean => {
  const { state } = useUsers();
  return state.isLoading;
};

/**
 * Hook to get the users error state
 * @returns The error message or null if no error
 */
export const useUsersError = (): string | null => {
  const { state } = useUsers();
  return state.error;
};

