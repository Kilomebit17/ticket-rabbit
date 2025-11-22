import type { IUsersState, UsersActions } from './types';
import { EUsersActionType } from './types';

/**
 * Users reducer function
 */
export const reducer = (
  state: IUsersState,
  action: UsersActions
): IUsersState => {
  switch (action.type) {
    case EUsersActionType.SET_LOADING: {
      return { ...state, isLoading: action.loading, error: null };
    }

    case EUsersActionType.SET_SEARCH_RESULTS: {
      return {
        ...state,
        searchResults: action.results,
        isLoading: false,
        error: null,
      };
    }

    case EUsersActionType.SET_ERROR: {
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    }

    case EUsersActionType.CLEAR_ERROR: {
      return { ...state, error: null };
    }

    case EUsersActionType.CLEAR_SEARCH_RESULTS: {
      return {
        ...state,
        searchResults: [],
        error: null,
      };
    }

    default:
      return state;
  }
};

