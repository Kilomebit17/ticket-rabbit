import type { IAuthState, AuthActions } from './types';
import { EAuthActionType } from './types';

/**
 * Auth reducer function
 */
export const reducer = (
  state: IAuthState,
  action: AuthActions
): IAuthState => {
  switch (action.type) {
    case EAuthActionType.SET_LOADING: {
      return { ...state, isLoading: action.loading, error: null };
    }

    case EAuthActionType.SET_USER: {
      return {
        ...state,
        user: action.user,
        isLoading: false,
        error: null,
      };
    }

    case EAuthActionType.SET_ERROR: {
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    }

    case EAuthActionType.CLEAR_ERROR: {
      return { ...state, error: null };
    }

    case EAuthActionType.LOGOUT: {
      return {
        ...state,
        user: null,
        error: null,
        isLoading: false,
      };
    }

    default:
      return state;
  }
};

