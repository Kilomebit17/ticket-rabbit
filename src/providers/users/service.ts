import { useReducer, useCallback } from 'react';
import type { User } from '@/types';
import type {
  IUsersContext,
  ISearchUsersResponse,
} from './types';
import { EUsersActionType } from './types';
import initialState from './state';
import { reducer } from './reducer';
import { useHttpClient } from '@/providers/http-client';
import { ERROR_MESSAGES, LOG_MESSAGES } from '@/constants';

/**
 * Users service hook
 * Combines state management with API calls
 */
export const useUsersService = (): IUsersContext => {
  const httpClient = useHttpClient();
  const [state, dispatch] = useReducer(reducer, initialState());

  const setLoading = useCallback((loading: boolean): void => {
    dispatch({ type: EUsersActionType.SET_LOADING, loading });
  }, []);

  const setSearchResults = useCallback((results: User[]): void => {
    dispatch({ type: EUsersActionType.SET_SEARCH_RESULTS, results });
  }, []);

  const setError = useCallback((error: string): void => {
    dispatch({ type: EUsersActionType.SET_ERROR, error });
  }, []);

  const clearError = useCallback((): void => {
    dispatch({ type: EUsersActionType.CLEAR_ERROR });
  }, []);

  const clearSearchResults = useCallback((): void => {
    dispatch({ type: EUsersActionType.CLEAR_SEARCH_RESULTS });
  }, []);

  /**
   * Search users by username
   */
  const searchByUsername = useCallback(
    async (username: string): Promise<User[]> => {
      if (!username.trim()) {
        setSearchResults([]);
        return [];
      }

      setLoading(true);
      try {
        const response = await httpClient.get<ISearchUsersResponse>(
          '/user/search',
          {
            params: { username },
          }
        );
        const users = response.data.users || [];
        setSearchResults(users);
        return users;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.FAILED_TO_SEARCH_USERS;
        setError(errorMessage);
        console.error(LOG_MESSAGES.ERROR, error);
        setSearchResults([]);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [httpClient, setLoading, setSearchResults, setError]
  );

  return {
    state,
    setLoading,
    setSearchResults,
    setError,
    clearError,
    clearSearchResults,
    searchByUsername,
  };
};

