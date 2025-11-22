import { useReducer, useCallback } from 'react';
import type { User } from '@/types';
import type {
  IAuthContext,
  ICreateUserRequest,
  ICreateUserResponse,
  IGetUserResponse,
} from './types';
import { EAuthActionType } from './types';
import initialState from './state';
import { reducer } from './reducer';
import { useHttpClient } from '@/providers/http-client';
import { ERROR_MESSAGES, LOG_MESSAGES } from '@/constants';

/**
 * Check if error is a 404 Not Found error
 */
const isNotFoundError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status?: number } };
    return axiosError.response?.status === 404;
  }
  return false;
};

/**
 * Auth service hook
 * Combines state management with API calls
 */
export const useAuthService = (): IAuthContext => {
  const httpClient = useHttpClient();
  const [state, dispatch] = useReducer(reducer, initialState());

  const setLoading = useCallback((loading: boolean): void => {
    dispatch({ type: EAuthActionType.SET_LOADING, loading });
  }, []);

  const setUser = useCallback((user: User | null): void => {
    dispatch({ type: EAuthActionType.SET_USER, user });
  }, []);

  const setError = useCallback((error: string): void => {
    dispatch({ type: EAuthActionType.SET_ERROR, error });
  }, []);

  const clearError = useCallback((): void => {
    dispatch({ type: EAuthActionType.CLEAR_ERROR });
  }, []);

  const logout = useCallback((): void => {
    dispatch({ type: EAuthActionType.LOGOUT });
  }, []);

  /**
   * Check if current user exists
   */
  const checkUser = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await httpClient.get<IGetUserResponse>('/auth/me');
      setUser(response.data.user);
    } catch (error: unknown) {
      if (isNotFoundError(error)) {
        setUser(null);
      } else {
        const errorMessage =
          error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_CHECK_USER;
        setError(errorMessage);
      }
    }
  }, [httpClient, setLoading, setUser, setError]);

  /**
   * Create a new user
   */
  const createUser = useCallback(
    async (data: ICreateUserRequest): Promise<User> => {
      setLoading(true);
      try {
        const response = await httpClient.post<ICreateUserResponse>(
          '/auth/register',
          data
        );
        setUser(response.data.user);
        return response.data.user;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_CREATE_USER;
        setError(errorMessage);
        console.error(LOG_MESSAGES.FAILED_TO_CREATE_USER, error);
        throw error;
      }
    },
    [httpClient, setLoading, setUser, setError]
  );

  return {
    state,
    setLoading,
    setUser,
    setError,
    clearError,
    logout,
    checkUser,
    createUser,
  };
};

