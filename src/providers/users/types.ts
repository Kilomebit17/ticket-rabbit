import type { User } from '@/types';

/**
 * Base reducer action interface
 */
export interface IReducerAction<T = string> {
  type: T;
}

/**
 * Users state interface
 */
export interface IUsersState {
  searchResults: User[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Users action types enum
 */
export enum EUsersActionType {
  SET_LOADING = 'SET_LOADING',
  SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS',
  SET_ERROR = 'SET_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',
  CLEAR_SEARCH_RESULTS = 'CLEAR_SEARCH_RESULTS',
}

/**
 * Users action interfaces
 */
export interface IActionSetLoading
  extends IReducerAction<EUsersActionType.SET_LOADING> {
  loading: boolean;
}

export interface IActionSetSearchResults
  extends IReducerAction<EUsersActionType.SET_SEARCH_RESULTS> {
  results: User[];
}

export interface IActionSetError
  extends IReducerAction<EUsersActionType.SET_ERROR> {
  error: string;
}

export interface IActionClearError
  extends IReducerAction<EUsersActionType.CLEAR_ERROR> {}

export interface IActionClearSearchResults
  extends IReducerAction<EUsersActionType.CLEAR_SEARCH_RESULTS> {}

/**
 * Union type for all users actions
 */
export type UsersActions =
  | IActionSetLoading
  | IActionSetSearchResults
  | IActionSetError
  | IActionClearError
  | IActionClearSearchResults;

/**
 * Search users by username response
 */
export interface ISearchUsersResponse {
  users: User[];
}

/**
 * Users context interface
 */
export interface IUsersContext {
  state: IUsersState;
  setLoading: (loading: boolean) => void;
  setSearchResults: (results: User[]) => void;
  setError: (error: string) => void;
  clearError: () => void;
  clearSearchResults: () => void;
  searchByUsername: (username: string) => Promise<User[]>;
}

