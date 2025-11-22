import { createContext } from 'react';
import type { IUsersContext } from './types';
import initialState from './state';

/**
 * Users context with default values
 * Exported for useUsers hook
 */
export const UsersContext = createContext<IUsersContext>({
  state: initialState(),
  setLoading: () => {},
  setSearchResults: () => {},
  setError: () => {},
  clearError: () => {},
  clearSearchResults: () => {},
  searchByUsername: async () => {
    throw new Error('UsersProvider not initialized');
  },
});

